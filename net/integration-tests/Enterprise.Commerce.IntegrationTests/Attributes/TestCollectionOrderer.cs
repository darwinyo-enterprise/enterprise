using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace Enterprise.Commerce.IntegrationTests.Attributes
{
    public class TestCollectionOrderer: ITestCaseOrderer
    {
        public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases) where TTestCase : ITestCase
        {
            var sortedMethods = new SortedDictionary<int, TTestCase>();

            foreach (TTestCase testCase in testCases)
            {
                IAttributeInfo attribute = testCase.TestMethod.Method.
                    GetCustomAttributes((typeof(TestPriorityAttribute)
                        .AssemblyQualifiedName)).FirstOrDefault();

                if (attribute != null)
                {
                    var priority = attribute.GetNamedArgument<int>("Priority");
                    sortedMethods.Add(priority, testCase);
                }
            }

            return sortedMethods.Values;
        }

        public const string TypeName = "Enterprise.Commerce.IntegrationTests.TestCollectionOrderer";

        public const string AssembyName = "Enterprise.Commerce.IntegrationTests";
    }
}
