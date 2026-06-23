using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using System.Linq.Expressions;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);
    var database = new Database();

    Console.WriteLine("The server is running");
    Console.WriteLine($"Local:   http://localhost:{port}/website/pages/index.html");
    Console.WriteLine($"Network: http://{Network.GetLocalNetworkIPAddress()}:{port}/website/pages/index.html");

    while (true)
    {
      var request = server.WaitForRequest();

      Console.WriteLine($"Recieved a request: {request.Name}");

      try
      {
        if (request.Name == "signUp")
        {
          var (username, password) = request.GetParams<(string, string)>();

          if (database.Users.Any(u => u.Username == username))
          {
            request.Respond<string?>(null);
            continue;
          }

          string token = Guid.NewGuid().ToString();
          User user = new User(token, username, password);
          database.Users.Add(user);
          database.SaveChanges();
          request.Respond(token);
        }

        if (request.Name == "logIn")
        {
          var (username, password) = request.GetParams<(string, string)>();
          var user = database.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
          request.Respond(user?.Token);
        }

        if (request.Name == "getUser")
        {
          var token = request.GetParams<string>();
          var user = database.Users.FirstOrDefault(u => u.Token == token);
          request.Respond(user);
        }

        if (request.Name == "getHighScore")
        {
          bool found = false;
          var token = request.GetParams<string>();
          var user = database.Users.FirstOrDefault(u => u.Token == token);
          if(user == null)
          {
            request.Respond<string?>(null);
            continue;
          }
          var scores = database.Scores.OrderBy(score => -score.Amount).ToArray();

          for(var i = 0; i<scores.Length; i++)
          {
            if (scores[i].UserId == user!.Id)
            {
              request.Respond(scores[i].Amount);
              found = true;
              break;
            }
          }

          if (!found) request.Respond(0);
        }

        if (request.Name == "submitScore")
        {
          Console.WriteLine("step 1: got submitScore");
          var (token, score) = request.GetParams<(string, int)>();
          Console.WriteLine($"step 2: token={token}, score={score}");
          var user = database.Users.FirstOrDefault(u => u.Token == token);
          Console.WriteLine($"step 3: user={user?.Username ?? "null"}");
          if(user == null)
          {
            request.Respond<string?>(null);
            continue;
          }

          if(score > user.HighScore)
          {
            user.HighScore = score;
            database.SaveChanges();
          }

          UScore NewScore = new UScore(user.Id, score);
          Console.WriteLine($"step 4: saving score");
          database.Scores.Add(NewScore);
          database.SaveChanges();
          Console.WriteLine($"step 5: saved!");
          request.Respond(NewScore);
        }

        if (request.Name == "getTop10")
        {
          User[] highScores = database.Users.OrderBy(user1 => -user1.HighScore).Take(10).ToArray();
          request.Respond(highScores);
        }

        if (request.Name == "getPlacement")
        {
          bool found = false;
          var token = request.GetParams<string>();
          Console.WriteLine("got token: " + token);
          var user = database.Users.FirstOrDefault(u => u.Token == token);
          if (user == null)
          {
            request.Respond<string?>(null);
            continue;
          }
          Console.WriteLine("got user: " + user.Username + ", id: " + user.Id);
          User[] UsersByScore = database.Users.OrderBy(user1 => -user1.HighScore).ToArray();

          for(var i = 0; i<UsersByScore.Length; i++)
          {
            Console.WriteLine("comparing username, id: " + user.Username + " " + user.Id + " to id: " + UsersByScore[i].Id);
            if(UsersByScore[i].Id == user.Id)
            {
              Console.WriteLine($"comparing userid {user.Id} to {UsersByScore[i].Id}");
              request.Respond(i+1);
              Console.WriteLine($"found user placmet: {i+1}");
              found = true;
              continue;
            }
          }
        if (!found) request.Respond(0);
        }

        if (request.Name == "getGameAmount")
        {
          var token = request.GetParams<string>();
          var user = database.Users.FirstOrDefault(u => u.Token == token);
          if (user == null)
          {
            Console.WriteLine("Got requets getGameAmount and user is null");
            request.Respond<string?>(null);
            continue;
          }
          int AllGames = database.Scores.Count(score => score.UserId == user.Id);
          request.Respond(AllGames);
        }

      }
      catch (Exception exception)
      {
        request.SetStatusCode(500);
        Log.WriteException(exception);
      }
    }
  }
}


class Database() : DatabaseCore("database")
{
  public DbSet<User> Users { get; set; } = default!;
  public DbSet<UScore> Scores { get; set; } = default!;
}

class User(string token, string username, string password)
{
  public int Id { get; set; } = default!;
  [JsonIgnore] public string Token { get; set; } = token;
  public string Username { get; set; } = username;
  [JsonIgnore] public string Password { get; set; } = password;
  public int HighScore { get; set; }= 0;
}


class UScore(int userId, int amount)
{
  public int Id { get; set; }
  public int UserId { get; set; } = userId;
  public int Amount { get; set; } = amount;
}