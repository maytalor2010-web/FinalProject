using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;

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
}

class User(string token, string username, string password)
{
  public int Id { get; set; } = default!;
  [JsonIgnore] public string Token { get; set; } = token;
  public string Username { get; set; } = username;
  [JsonIgnore] public string Password { get; set; } = password;
}