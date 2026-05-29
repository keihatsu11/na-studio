let allProducts = [];
let filteredProducts = [];

const itemsPerPage = 20;
let visibleItems = 20;

let selectedCategory = "semua";
let selectedPrice = "semua";

function cleanText(text){
return String(text || "")
.replace(/\uFEFF/g,"")
.trim()
.toLowerCase();
}

function getFolder(kategori){

kategori =
cleanText(kategori);

const map = {

"pernikahan":
"pernikahan",

"khitan":
"khitan",

"aqiqah":
"aqiqah",

"ulang tahun":
"ulangtahun"
};

return map[kategori]
|| "pernikahan";
}

function createProductCard(product){

const folder =
getFolder(product.kategori);

return `

<div class="product-card">

<a href=
"detail.html?kode=
${product.kode}">

<img
loading="lazy"
class="preview-image"

src=
"assets/images/${folder}/${product.gambar}"

alt=
"${product.nama}">

</a>

<h3>
${product.kode}
</h3>

<p>
${product.nama}
</p>

<span>
Rp${Number(
product.harga || 0
).toLocaleString(
'id-ID'
)}/pcs
</span>

<a
class="btn-detail"

href=
"detail.html?kode=
${product.kode}">

Lihat Detail

</a>

</div>
`;
}

function renderProducts(products){

const container =
document.getElementById(
"product-list"
);

const loadBtn =
document.getElementById(
"loadMoreBtn"
);

container.innerHTML = "";

const visible =
products.slice(
0,
visibleItems
);

visible.forEach(product=>{

container.innerHTML +=
createProductCard(
product
);

});

if(loadBtn){

loadBtn.style.display =
visibleItems >=
products.length
?
"none"
:
"inline-flex";
}

initHoverPreview();
}

function applyFilters(){

const keyword =
cleanText(
document
.getElementById(
"searchInput"
)?.value || ""
);

filteredProducts =
allProducts.filter(
product=>{

const categoryMatch =

selectedCategory
=== "semua"

||

cleanText(
product.kategori
)

===

selectedCategory;

const price =
Number(
product.harga
);

let priceMatch =
true;

if(
selectedPrice
!== "semua"
){

if(
selectedPrice
=== "4000+"
){

priceMatch =
price >= 4000;

}else{

const range =
selectedPrice
.split("-");

priceMatch =

price >=
Number(range[0])

&&

price <=
Number(range[1]);
}
}

const keywordMatch =

cleanText(
product.kode
)
.includes(keyword)

||

cleanText(
product.nama
)
.includes(keyword);

return (
categoryMatch
&&
priceMatch
&&
keywordMatch
);

});

visibleItems = 20;

renderProducts(
filteredProducts
);
}

function initHoverPreview(){

const previewBox =
document.getElementById(
"hoverPreview"
);

const previewImage =
document.getElementById(
"hoverPreviewImage"
);

if(
!previewBox
||
!previewImage
) return;

document
.querySelectorAll(
".preview-image"
)
.forEach(image=>{

image
.addEventListener(
"mouseenter",
function(){

if(
window.innerWidth
<=768
) return;

previewImage.src =
this.src;

previewBox.style.opacity =
"1";

previewBox.style.visibility =
"visible";
});

image
.addEventListener(
"mousemove",
function(e){

previewBox.style.left =
e.clientX+25+"px";

previewBox.style.top =
e.clientY-120+"px";
});

image
.addEventListener(
"mouseleave",
function(){

previewBox.style.opacity =
"0";

previewBox.style.visibility =
"hidden";
});
});
}

Papa.parse(
"data/products.csv",
{
download:true,
header:true,
skipEmptyLines:true,

complete:function(results){

allProducts =
results.data;

filteredProducts =
allProducts;

renderProducts(
filteredProducts
);

document
.getElementById(
"searchInput"
)
?.addEventListener(
"input",
applyFilters
);

document
.getElementById(
"categoryFilter"
)
?.addEventListener(
"change",
function(){

selectedCategory =
cleanText(
this.value
);

applyFilters();
});

document
.getElementById(
"priceFilter"
)
?.addEventListener(
"change",
function(){

selectedPrice =
this.value;

applyFilters();
});

document
.getElementById(
"toggleFilter"
)
?.addEventListener(
"click",
function(){

document
.getElementById(
"filterPanel"
)
.classList.toggle(
"show"
);
});

document
.getElementById(
"loadMoreBtn"
)
?.addEventListener(
"click",
function(){

visibleItems +=
itemsPerPage;

renderProducts(
filteredProducts
);
});

}
});