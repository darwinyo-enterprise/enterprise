﻿using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Identity.API.Extensions;
using Identity.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Identity.API.Data
{
    public class ApplicationDbContextSeed
    {
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher = new PasswordHasher<ApplicationUser>();

        public async Task SeedAsync(ApplicationDbContext context, IHostingEnvironment env,
            ILogger<ApplicationDbContextSeed> logger, IOptions<AppSettings> settings, int? retry = 0)
        {
            if (retry != null)
            {
                var retryForAvaiability = retry.Value;

                try
                {
                    var useCustomizationData = settings.Value.UseCustomizationData;
                    var contentRootPath = env.ContentRootPath;
                    var webroot = env.WebRootPath;

                    if (!context.Users.Any())
                    {
                        context.Users.AddRange(useCustomizationData
                            ? GetUsersFromFile(contentRootPath, logger)
                            : GetDefaultUser());

                        await context.SaveChangesAsync();
                    }

                    if (!context.Roles.Any())
                    {
                        context.Roles.AddRange(useCustomizationData
                            ? GetRolesFromFile(contentRootPath, logger)
                            : GetDefaultRole());

                        await context.SaveChangesAsync();
                    }

                    if (!context.UserRoles.Any())
                    {
                        context.UserRoles.AddRange(useCustomizationData
                            ? GetUserRolesFromFile(contentRootPath, logger, context)
                            : GetDefaultUserRole(context));

                        await context.SaveChangesAsync();
                    }

                    if (useCustomizationData) GetPreconfiguredImages(contentRootPath, webroot, logger);
                }
                catch (Exception ex)
                {
                    if (retryForAvaiability < 10)
                    {
                        retryForAvaiability++;

                        logger.LogError(ex.Message, $"There is an error migrating data for ApplicationDbContext");

                        await SeedAsync(context, env, logger, settings, retryForAvaiability);
                    }
                }
            }
        }

        private IEnumerable<ApplicationUser> GetUsersFromFile(string contentRootPath, ILogger logger)
        {
            var csvFileUsers = Path.Combine(contentRootPath, "Setup", "Users.csv");

            if (!File.Exists(csvFileUsers)) return GetDefaultUser();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders =
                {
                    "cardholdername", "cardnumber", "cardtype", "city", "country",
                    "email", "expiration", "lastname", "name", "phonenumber",
                    "username", "zipcode", "state", "street", "securitynumber",
                    "normalizedemail", "normalizedusername", "password"
                };
                csvheaders = GetHeaders(requiredHeaders, csvFileUsers);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);

                return GetDefaultUser();
            }

            var users = File.ReadAllLines(csvFileUsers)
                .Skip(1) // skip header column
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(column => CreateApplicationUser(column, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null)
                .ToList();

            return users;
        }

        private IEnumerable<ApplicationRole> GetRolesFromFile(string contentRootPath, ILogger logger)
        {
            var csvFileUsers = Path.Combine(contentRootPath, "Setup", "Roles.csv");

            if (!File.Exists(csvFileUsers)) return GetDefaultRole();

            string[] csvheaders;
            try
            {
                string[] requiredHeaders =
                {
                    "role"
                };
                csvheaders = GetHeaders(requiredHeaders, csvFileUsers);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);

                return GetDefaultRole();
            }

            var roles = File.ReadAllLines(csvFileUsers)
                .Skip(1) // skip header column
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(column => CreateApplicationRole(column, csvheaders))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null)
                .ToList();

            return roles;
        }

        private IEnumerable<ApplicationUserRole> GetUserRolesFromFile(string contentRootPath, ILogger logger,
            ApplicationDbContext ctx)
        {
            var csvFileUsers = Path.Combine(contentRootPath, "Setup", "UserRoles.csv");

            if (!File.Exists(csvFileUsers)) return GetDefaultUserRole(ctx);

            string[] csvheaders;
            try
            {
                string[] requiredHeaders =
                {
                    "role", "username"
                };
                csvheaders = GetHeaders(requiredHeaders, csvFileUsers);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);

                return GetDefaultUserRole(ctx);
            }

            var userRoles = File.ReadAllLines(csvFileUsers)
                .Skip(1) // skip header column
                .Select(row => Regex.Split(row, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"))
                .SelectTry(column => CreateApplicationUserRole(column, csvheaders, ctx))
                .OnCaughtException(ex =>
                {
                    logger.LogError(ex.Message);
                    return null;
                })
                .Where(x => x != null)
                .ToList();

            return userRoles;
        }

        private ApplicationUser CreateApplicationUser(string[] column, string[] headers)
        {
            if (column.Count() != headers.Count())
                throw new Exception(
                    $"column count '{column.Count()}' not the same as headers count'{headers.Count()}'");

            var cardtypeString = column[Array.IndexOf(headers, "cardtype")].Trim('"').Trim();
            if (!int.TryParse(cardtypeString, out var cardtype))
                throw new Exception($"cardtype='{cardtypeString}' is not a number");

            var user = new ApplicationUser
            {
                CardHolderName = column[Array.IndexOf(headers, "cardholdername")].Trim('"').Trim(),
                CardNumber = column[Array.IndexOf(headers, "cardnumber")].Trim('"').Trim(),
                CardType = cardtype,
                City = column[Array.IndexOf(headers, "city")].Trim('"').Trim(),
                Country = column[Array.IndexOf(headers, "country")].Trim('"').Trim(),
                Email = column[Array.IndexOf(headers, "email")].Trim('"').Trim(),
                Expiration = column[Array.IndexOf(headers, "expiration")].Trim('"').Trim(),
                Id = Guid.NewGuid().ToString(),
                LastName = column[Array.IndexOf(headers, "lastname")].Trim('"').Trim(),
                Name = column[Array.IndexOf(headers, "name")].Trim('"').Trim(),
                PhoneNumber = column[Array.IndexOf(headers, "phonenumber")].Trim('"').Trim(),
                UserName = column[Array.IndexOf(headers, "username")].Trim('"').Trim(),
                ZipCode = column[Array.IndexOf(headers, "zipcode")].Trim('"').Trim(),
                State = column[Array.IndexOf(headers, "state")].Trim('"').Trim(),
                Street = column[Array.IndexOf(headers, "street")].Trim('"').Trim(),
                SecurityNumber = column[Array.IndexOf(headers, "securitynumber")].Trim('"').Trim(),
                NormalizedEmail = column[Array.IndexOf(headers, "normalizedemail")].Trim('"').Trim(),
                NormalizedUserName = column[Array.IndexOf(headers, "normalizedusername")].Trim('"').Trim(),
                SecurityStamp = Guid.NewGuid().ToString("D"),
                PasswordHash = column[Array.IndexOf(headers, "password")].Trim('"').Trim() // Note: This is the password
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);

            return user;
        }

        private ApplicationRole CreateApplicationRole(string[] column, string[] headers)
        {
            if (column.Count() != headers.Count())
                throw new Exception(
                    $"column count '{column.Count()}' not the same as headers count'{headers.Count()}'");

            var roleString = column[Array.IndexOf(headers, "role")].Trim('"').Trim();

            var role = new ApplicationRole(roleString);

            return role;
        }

        private ApplicationUserRole CreateApplicationUserRole(string[] column, string[] headers,
            ApplicationDbContext ctx)
        {
            if (column.Count() != headers.Count())
                throw new Exception(
                    $"column count '{column.Count()}' not the same as headers count'{headers.Count()}'");

            var roleString = column[Array.IndexOf(headers, "role")].Trim('"').Trim();
            var userString = column[Array.IndexOf(headers, "username")].Trim('"').Trim();

            var roleId = ctx.Roles.First(x => x.Name == roleString).Id;
            var userId = ctx.Users.First(x => x.UserName == userString).Id;

            var userRole = new ApplicationUserRole
            {
                RoleId = roleId,
                UserId = userId
            };

            return userRole;
        }

        private IEnumerable<ApplicationUser> GetDefaultUser()
        {
            var user =
                new ApplicationUser
                {
                    CardHolderName = "DemoUser",
                    CardNumber = "4012888888881881",
                    CardType = 1,
                    City = "Redmond",
                    Country = "U.S.",
                    Email = "demouser@enterprise.com",
                    Expiration = "12/20",
                    Id = Guid.NewGuid().ToString(),
                    LastName = "DemoLastName",
                    Name = "DemoUser",
                    PhoneNumber = "1234567890",
                    UserName = "demouser@enterprise.com",
                    ZipCode = "98052",
                    State = "WA",
                    Street = "15703 NE 61st Ct",
                    SecurityNumber = "535",
                    NormalizedEmail = "DEMOUSER@ENTERPRISE.COM",
                    NormalizedUserName = "DEMOUSER@ENTERPRISE.COM",
                    SecurityStamp = Guid.NewGuid().ToString("D")
                };

            user.PasswordHash = _passwordHasher.HashPassword(user, "P@ssw0rd");

            return new List<ApplicationUser>
            {
                user
            };
        }

        private IEnumerable<ApplicationRole> GetDefaultRole()
        {
            var role = new List<ApplicationRole>
            {
                new ApplicationRole("Admin"),
                new ApplicationRole("End User")
            };
            return role;
        }

        private IEnumerable<ApplicationUserRole> GetDefaultUserRole(ApplicationDbContext ctx)
        {
            var users = ctx.Users.ToList();
            var roles = ctx.Roles.ToList();
            var role = new List<ApplicationUserRole>
            {
                new ApplicationUserRole
                {
                    UserId = users[0].Id,
                    RoleId = roles[0].Id
                },
                new ApplicationUserRole
                {
                    UserId = users[1].Id,
                    RoleId = roles[1].Id
                }
            };
            return role;
        }

        private static string[] GetHeaders(string[] requiredHeaders, string csvfile)
        {
            var csvheaders = File.ReadLines(csvfile).First().ToLowerInvariant().Split(',');

            if (csvheaders.Count() != requiredHeaders.Count())
                throw new Exception(
                    $"requiredHeader count '{requiredHeaders.Count()}' is different then read header '{csvheaders.Count()}'");

            foreach (var requiredHeader in requiredHeaders)
                if (!csvheaders.Contains(requiredHeader))
                    throw new Exception($"does not contain required header '{requiredHeader}'");

            return csvheaders;
        }

        private static void GetPreconfiguredImages(string contentRootPath, string webroot, ILogger logger)
        {
            try
            {
                var imagesZipFile = Path.Combine(contentRootPath, "Setup", "images.zip");
                if (!File.Exists(imagesZipFile))
                {
                    logger.LogError($" zip file '{imagesZipFile}' does not exists.");
                    return;
                }

                var imagePath = Path.Combine(webroot, "images");
                var imageFiles = Directory.GetFiles(imagePath).Select(file => Path.GetFileName(file)).ToArray();

                using (var zip = ZipFile.Open(imagesZipFile, ZipArchiveMode.Read))
                {
                    foreach (var entry in zip.Entries)
                        if (imageFiles.Contains(entry.Name))
                        {
                            var destinationFilename = Path.Combine(imagePath, entry.Name);
                            if (File.Exists(destinationFilename)) File.Delete(destinationFilename);
                            entry.ExtractToFile(destinationFilename);
                        }
                        else
                        {
                            logger.LogWarning($"Skip file '{entry.Name}' in zipfile '{imagesZipFile}'");
                        }
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Exception in method GetPreconfiguredImages WebMVC. Exception Message={ex.Message}");
            }
        }
    }
}