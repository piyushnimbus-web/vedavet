export const previewProducts=[
 ['Dog Harness – Neoprene Comfort Liner','Harnesses',12,'product-image-1.jpg'],
 ['Pet Shampoo & Wash','Grooming',20,'product-image-2.jpg'],
 ['Dental Brushing Chews','Treats',36,'product-image-3.jpg'],
 ['Two Door Pet Carrier','Travel',18,'product-image-4.jpg'],
 ['Soft Pet Sleeping Bed','Beds',19,'product-image-1.jpg'],
 ['Interactive Dog Puzzle Toy','Toys',18,'product-image-2.jpg'],
 ['Calming Puppy Bites','Treats',16,'product-image-3.jpg'],
 ['Extra Gentle Puppy Shampoo','Grooming',30,'product-image-4.jpg'],
 ['Cozy Round Pet Bed','Beds',22,'product-image-1.jpg'],
 ['Adjustable Dog Harness','Harnesses',11,'product-image-2.jpg'],
 ['Healthy Dog Food','Food',19,'product-image-3.jpg'],
 ['Pet Wellness Supplement','Health',16,'product-image-4.jpg'],
 ['Nutritious Cat Food','Food',30,'product-image-1.jpg'],
 ['Pet Rope Toy','Toys',22,'product-image-2.jpg'],
 ['Grooming Gloves','Grooming',11,'product-image-3.jpg']
].map(([name,category,price,image],i)=>({id:'preview-'+i,slug:'preview-'+i,name,category,price,image_url:'/beta/node/images/'+image,description:'Sample catalogue item for design preview only. Actual product details and availability will be supplied by the hospital shop.',stock:0,preview:true}));
