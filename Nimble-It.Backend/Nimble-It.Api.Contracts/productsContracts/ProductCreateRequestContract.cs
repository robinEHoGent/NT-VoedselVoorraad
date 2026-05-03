using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Nimble_It.Api.Contracts.productsContracts
{
    //task 219 
    public class ProductCreateRequestContract //voor post endpoint (task221-223: req contr nodig om data frontend te ontvangen (prodname/catid/uomid),validatie toepassing (naam ni leeg))
    {
        public string ProductName { get; set; } = string.Empty;

        public int CategoryId { get; set; }

        public int UomId { get; set; }

        public IFormFile? ImageFile { get; set; } // task 216: file upload voor image storage (URL opslaan in db)
        public string? ImageUrl { get; set; } // Direct blob storage URL if selecting from existing images
    }
}

//voor response wordt product resp contract recycled (tenzij liever productcreaterespcontr? maar dat is dan "duplicatie" van code die er al is)