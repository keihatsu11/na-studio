let allProducts = [];
let filteredProducts = [];

const itemsPerPage = 20;
let visibleItems = 20;


// ====================
// CLEAN TEXT
// ====================

function cleanText(text){

    return String(text || "")
    .replace(/\uFEFF/g, "")
    .trim()
    .toLowerCase();
}


// ====================
// CATEGORY FOLDER
// ====================

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


// ====================
// CARD PRODUCT
// ====================

function createProductCard(product){

    const folder =
    getFolder(
    product.kategori
    );

    return `

    <div class="product-card">

        <a href=
        "detail.html?kode=
        ${product.kode}">

            <img
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


// ====================
// RENDER PRODUCT
// ====================

function renderProducts(products){

    const container =
    document.getElementById(
    "product-list"
    );

    const loadBtn =
    document.getElementById(
    "loadMoreBtn"
    );

    if(!container) return;

    container.innerHTML = "";

    const visible =
    products.slice(
    0,
    visibleItems
    );

    visible.forEach(
    product => {

        container.innerHTML +=
        createProductCard(
        product
        );
    });

    // show hide button

    if(loadBtn){

        if(
        visibleItems
        >=
        products.length
        ){

            loadBtn.style.display =
            "none";

        }else{

            loadBtn.style.display =
            "inline-flex";
        }
    }

    initHoverPreview();
}


// ====================
// FILTER BUTTON ACTIVE
// ====================

function setActiveButton(button){

    document
    .querySelectorAll(
    ".category-filter button"
    )
    .forEach(btn => {

        btn.classList.remove(
        "active"
        );
    });

    button.classList.add(
    "active"
    );
}


// ====================
// HOVER PREVIEW
// ====================

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
    !previewBox ||
    !previewImage
    ) return;

    const images =
    document.querySelectorAll(
    ".preview-image"
    );

    images.forEach(image => {

        image.addEventListener(
        "mouseenter",
        function(){

            if(
            window.innerWidth
            <= 768
            ) return;

            previewImage.src =
            this.src;

            previewBox.style.opacity =
            "1";

            previewBox.style.visibility =
            "visible";
        });

        image.addEventListener(
        "mousemove",
        function(e){

            previewBox.style.left =
            e.clientX + 25 + "px";

            previewBox.style.top =
            e.clientY - 120 + "px";
        });

        image.addEventListener(
        "mouseleave",
        function(){

            previewBox.style.opacity =
            "0";

            previewBox.style.visibility =
            "hidden";
        });

    });
}


// ====================
// LOAD CSV
// ====================

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


// render first
renderProducts(
filteredProducts
);


// ====================
// SEARCH
// ====================

const searchInput =
document.getElementById(
"searchInput"
);

if(searchInput){

searchInput
.addEventListener(
"input",
function(){

const keyword =
cleanText(
this.value
);

visibleItems = 20;

filteredProducts =
allProducts.filter(
product =>

cleanText(
product.kode
)
.includes(
keyword
)

||

cleanText(
product.nama
)
.includes(
keyword
)

);

renderProducts(
filteredProducts
);

});
}


// ====================
// FILTER
// ====================

document
.querySelectorAll(
".category-filter button"
)
.forEach(button => {

button
.addEventListener(
"click",
function(){

setActiveButton(
this
);

const category =
cleanText(
this.dataset.category
);

visibleItems = 20;

if(
category
=== "semua"
){

filteredProducts =
allProducts;

}else{

filteredProducts =
allProducts.filter(
product =>

cleanText(
product.kategori
)

===

category

);
}

renderProducts(
filteredProducts
);

});
});


// ====================
// LOAD MORE
// ====================

const loadMoreBtn =
document.getElementById(
"loadMoreBtn"
);

if(loadMoreBtn){

loadMoreBtn
.addEventListener(
"click",
function(){

visibleItems +=
itemsPerPage;

renderProducts(
filteredProducts
);

});
}

}
});