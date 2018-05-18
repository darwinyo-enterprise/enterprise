using System;

namespace Enterprise.Commerce.IntegrationTests.Attributes
{
    public class TestPriorityAttribute : Attribute
    {
        public TestPriorityAttribute(int priority)
        {
            this.Priority = priority;
        }

        public int Priority { get; set; }
    }
}