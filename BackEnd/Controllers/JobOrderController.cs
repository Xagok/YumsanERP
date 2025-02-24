using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YumsanERP.Data;
using YumsanERP.Models;
using Microsoft.AspNetCore.Authorization;

namespace YumsanERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
//    [Authorize]
    public class JobOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobOrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/JobOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobOrder>>> GetJobOrders()
        {
            var allJobOrders = await _context.JobOrders.ToListAsync();
            foreach (var item in allJobOrders){
                item.Customer = _context.Customers.Find(item.CustomerId);
                item.Employee = _context.Employees.Find(item.EmployeeId);
            }
            return await _context.JobOrders.ToListAsync();
        }

        // GET: api/JobOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JobOrder>> GetJobOrder(int id)
        {
            var JobOrder = await _context.JobOrders.FindAsync(id);
           
            if (JobOrder == null)
            {
                return NotFound();
            }
            JobOrder.Customer=_context.Customers.Find(JobOrder.CustomerId);
            JobOrder.Employee=_context.Employees.Find(JobOrder.EmployeeId);
            return JobOrder;
        }
        // [HttpGet("{id}/customer")]
        // public async Task<ActionResult<JobOrder>> GetJobOrderCustomer(int id)
        // {
        //     var JobOrder = await _context.JobOrders.Include(j => j.Customer).FirstOrDefaultAsync(j => j.Id == id);

        //     if (JobOrder == null)
        //     {
        //         return NotFound($"JobOrder with ID {id} not found.");
        //     }

        //     return Ok(JobOrder.Customer);
        // }

        // POST: api/JobOrders
        [HttpPost]
        public async Task<ActionResult<JobOrder>> PostJobOrder(JobOrder JobOrder)
        {
            var customer = await _context.Customers.FindAsync(JobOrder.CustomerId);
            if (customer == null)
            {
                return NotFound($"Customer with ID {JobOrder.CustomerId} not found.");
            }

            JobOrder.Customer = customer;

            _context.JobOrders.Add(JobOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobOrder), new { id = JobOrder.Id }, JobOrder);
        }

        // PUT: api/JobOrders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJobOrder(int id, JobOrder JobOrder)
        {
            if (id != JobOrder.Id)
            {
                return BadRequest();
            }

            _context.Entry(JobOrder).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/JobOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobOrder(int id)
        {
            var JobOrder = await _context.JobOrders.FindAsync(id);
            if (JobOrder == null)
            {
                return NotFound();
            }

            _context.JobOrders.Remove(JobOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
