using System.Collections.Generic;
using IdentityServer4;
using IdentityServer4.Models;

namespace Identity.API.Configuration
{
    public class Config
    {
        // ApiResources define the apis in your system
        public static IEnumerable<ApiResource> GetApis()
        {
            return new List<ApiResource>
            {
                new ApiResource("orders", "Orders Service"),
                new ApiResource("basket", "Basket Service"),
                new ApiResource("catalog", "Catalog Service"),
                new ApiResource("mobileshoppingagg", "Mobile Shopping Aggregator"),
                new ApiResource("webshoppingagg", "Web Shopping Aggregator"),
                new ApiResource("orders.signalrhub", "Ordering Signalr Hub")
            };
        }

        // Identity resources are data like user ID, name, or email address of a user
        // see: http://docs.identityserver.io/en/release/configuration/resources.html
        public static IEnumerable<IdentityResource> GetResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        // client want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients(Dictionary<string, string> clientsUrl)
        {
            return new List<Client>
            {
                // JavaScript Client
                new Client
                {
                    ClientId = "js_commerce_client",
                    ClientName = "Enterprise Commerce Client App SPA OpenId Client",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = {$"{clientsUrl["CommerceClientSpa"]}/"},
                    RequireConsent = false,
                    PostLogoutRedirectUris = {$"{clientsUrl["CommerceClientSpa"]}/"},
                    AllowedCorsOrigins = {$"{clientsUrl["CommerceClientSpa"]}"},
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "orders",
                        "basket",
                        "catalog",
                        "orders.signalrhub"
                    }
                },
                new Client
                {
                    ClientId = "js_commerce_admin",
                    ClientName = "Enterprise Commerce Admin App SPA OpenId Client",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = {$"{clientsUrl["CommerceAdminSpa"]}/"},
                    RequireConsent = false,
                    PostLogoutRedirectUris = {$"{clientsUrl["CommerceAdminSpa"]}/"},
                    AllowedCorsOrigins = {$"{clientsUrl["CommerceAdminSpa"]}"},
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "orders",
                        "basket",
                        "catalog"
                    }
                },
                new Client
                {
                    ClientId = "catalogswaggerui",
                    ClientName = "Catalog Swagger UI",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,

                    RedirectUris = {$"{clientsUrl["CatalogApi"]}/swagger/oauth2-redirect.html"},
                    PostLogoutRedirectUris = {$"{clientsUrl["CatalogApi"]}/swagger/"},

                    AllowedScopes =
                    {
                        "catalog"
                    }
                },
                new Client
                {
                    ClientId = "basketswaggerui",
                    ClientName = "Basket Swagger UI",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,

                    RedirectUris = {$"{clientsUrl["BasketApi"]}/swagger/oauth2-redirect.html"},
                    PostLogoutRedirectUris = {$"{clientsUrl["BasketApi"]}/swagger/"},

                    AllowedScopes =
                    {
                        "basket"
                    }
                },
                new Client
                {
                    ClientId = "orderingswaggerui",
                    ClientName = "Ordering Swagger UI",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,

                    RedirectUris = {$"{clientsUrl["OrderingApi"]}/swagger/oauth2-redirect.html"},
                    PostLogoutRedirectUris = {$"{clientsUrl["OrderingApi"]}/swagger/"},

                    AllowedScopes =
                    {
                        "orders"
                    }
                }
            };
        }
    }
}