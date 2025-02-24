namespace YumsanERP.Models
{
    public class JobOrder
    {
        public int Id { get; set; }
        public int JobNumber { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; } 
        public string? Description { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime FinishDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string? PO { get; set; }
        public int QTY { get; set; }
        public string? OrderedBy { get; set; }
//        public string? Responsible { get; set; }
        public DateTime Deadline { get; set; }
        public decimal Price { get; set; }
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
