using System;
using Catalog.API.Helpers;
using Xunit;

namespace Catalog.API.Tests
{
    public class FileHelperTest
    {
        [Theory]
        [InlineData(".png", "image/png")]
        [InlineData(".gif", "image/gif")]
        [InlineData(".jpg", "image/jpeg")]
        public void GetImageMimeTypeFromImageFileExtension_Should_ReturnMimeTypeBasedOnExtensionFileProperly(string fileExtension, string expectedMimeType)
        {
            // Arrange

            // Act
            var result = FileHelper.GetImageMimeTypeFromImageFileExtension(fileExtension);

            // Assert
            Assert.Equal(result, expectedMimeType);
        }
    }
}
