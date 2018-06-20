using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Order.SignalRHub
{
    [Authorize]
    public class NotificationsHub : Hub<ITypedHubClient>
    {

        public override async Task OnConnectedAsync()
        {
            var claims = Context.User.Claims.ToList();
            await Groups.AddAsync(Context.ConnectionId, claims.First(x => x.Type== "preferred_username").Value);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var claims = Context.User.Claims.ToList();
            await Groups.RemoveAsync(Context.ConnectionId, claims.First(x => x.Type == "preferred_username").Value);
            await base.OnDisconnectedAsync(ex);
        }
    }
}
