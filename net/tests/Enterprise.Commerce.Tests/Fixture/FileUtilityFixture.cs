using Enterprise.Library.FileUtility;
using Microsoft.AspNetCore.Hosting;
using Moq;

namespace Enterprise.Commerce.Tests.Fixture
{
    /// <summary>
    ///     Test for validate file created or not will be at integration test
    /// </summary>
    public class FileUtilityFixture
    {
        public FileUtilityFixture()
        {
            var mockEnvironment = new Mock<IHostingEnvironment>();
            mockEnvironment
                .Setup(m => m.EnvironmentName)
                .Returns("Hosting:UnitTestEnvironment");
            FileUtility = new FileUtility(mockEnvironment.Object);
        }

        public IFileUtility FileUtility { get; set; }
    }
}