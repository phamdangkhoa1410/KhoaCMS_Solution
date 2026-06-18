using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class CartDetail
    {
        [Key]
        public int Id { get; set; }
        public int CartId { get; set; }

        [ForeignKey("CartId")]
        public virtual Cart? Cart { get; set; }
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
        public int Quantity { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.Now;
    }
}
