/*
Template: Coinex - Responsive Bootstrap 5 Admin Dashboard Template
Author: iqonic.design
Design and Developed by: iqonic.design
NOTE: This file contains the styling for responsive Template.
*/

/*----------------------------------------------
Index Of Script
------------------------------------------------

------- Plugin Init --------

:: Tooltip
:: Popover
:: NoUiSlider
:: CopyToClipboard
:: Vanila Datepicker
:: SliderTab
:: Data Tables
:: Active Class for Pricing Table

------ Functions --------

:: Loader Init
:: Resize Plugins
:: Sidebar Toggle
:: Back To Top

------- Listners ---------

:: DOMContentLoaded
:: Window Resize
------------------------------------------------
Index Of Script
----------------------------------------------*/
"use strict";
/*---------------------------------------------------------------------
              Popover
-----------------------------------------------------------------------*/

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

/*---------------------------------------------------------------------
                Tooltip
-----------------------------------------------------------------------*/

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-sidebar-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})



/*---------------------------------------------------------------------
Progress Bar
-----------------------------------------------------------------------*/
const progressBarInit = (elem) => {
  const currentValue = elem.getAttribute('aria-valuenow')
  elem.style.width = '0%'
  elem.style.transition = 'width 2s'
  new Waypoint({
    element: elem,
    handler: function () {
      setTimeout(() => {
        elem.style.width = currentValue + '%'
      }, 100);
    },
    offset: 'bottom-in-view',
  })
}

const customProgressBar = document.querySelectorAll('[data-toggle="progress-bar"]')
Array.from(customProgressBar, (elem) => {
  progressBarInit(elem)
})

/*---------------------------------------------------------------------
                 noUiSlider
-----------------------------------------------------------------------*/

const rangeSlider = document.querySelectorAll('.range-slider');

Array.from(rangeSlider, (elem) => {
  noUiSlider.create(elem, {
    start: [20, 80],
    connect: true,
    range: {
      'min': 0,
      'max': 100
    }
  })
})

const slider = document.querySelectorAll('.slider');

Array.from(slider, (elem) => {
  noUiSlider.create(elem, {
    start: 50,
    connect: [true, false],
    range: {
      'min': 0,
      'max': 100
    }
  })
})

/*---------------------------------------------------------------------
              Copy To Clipboard
-----------------------------------------------------------------------*/
const copy = document.querySelectorAll('[data-toggle="copy"]')
Array.from(copy, (elem) => {
  elem.addEventListener('click', (e) => {
    const target = elem.getAttribute("data-copy-target");
    let value = elem.getAttribute("data-copy-value");
    const container = document.querySelector(target);
    if (container !== undefined && container !== null) {
      if (container.value !== undefined && container.value !== null) {
        value = container.value;
      } else {
        value = container.innerHTML;
      }
    }
    if (value !== null) {
      const elem = document.createElement("input");
      document.querySelector("body").appendChild(elem);
      elem.value = value;
      elem.select();
      document.execCommand("copy");
      elem.remove();
    }
  })
});

/*---------------------------------------------------------------------
              Vanila Datepicker
-----------------------------------------------------------------------*/
const datepickers = document.querySelectorAll('.vanila-datepicker')
Array.from(datepickers, (elem) => {
  new Datepicker(elem)
})
const daterangePickers = document.querySelectorAll('.vanila-daterangepicker')
Array.from(daterangePickers, (elem) => {
  new DateRangePicker(elem)
})

/*---------------------------------------------------------------------
              CounterUp 2
-----------------------------------------------------------------------*/
if (window.counterUp !== undefined) {
  const counterUp = window.counterUp["default"];
  const counterUp2 = document.querySelectorAll('.counter')
  Array.from(counterUp2, (el) => {
    const waypoint = new Waypoint({
      element: el,
      handler: function () {
        counterUp(el, {
          duration: 1000,
          delay: 10,
        });
        this.destroy();
      },
      offset: "bottom-in-view",
    });
  })
}

// Smooth Scollbar
let Scrollbar
if (jQuery(".data-scrollbar").length) {
  Scrollbar = window.Scrollbar
  Scrollbar.init(document.querySelector('.data-scrollbar'), {
    continuousScrolling: false,
  })
}

/*---------------------------------------------------------------------
  Active Class for Pricing Table
-----------------------------------------------------------------------*/
jQuery("#my-table tr th").on('click', function () {
  jQuery('#my-table tr th').children().removeClass('active');
  jQuery(this).children().addClass('active');
  jQuery("#my-table td").each(function () {
    if (jQuery(this).hasClass('active')) {
      jQuery(this).removeClass('active')
    }
  });
  var col = jQuery(this).index();
  jQuery("#my-table tr td:nth-child(" + parseInt(col + 1) + ")").addClass('active');
});


/*---------------------------------------------------------------------
              Resize Plugins
-----------------------------------------------------------------------*/

const resizePlugins = () => {
  // sidebar-mini
  const tabs = document.querySelectorAll('.nav')
  const sidebarResponsive = document.querySelector('.sidebar-default')
  if (window.innerWidth < 991) {
    Array.from(tabs, (elem) => {
      if (!elem.classList.contains('flex-column') && elem.classList.contains('nav-tabs') && elem.classList.contains('nav-pills')) {
        elem.classList.add('flex-column', 'on-resize');
      }
    })
    if (sidebarResponsive !== null) {
      if (!sidebarResponsive.classList.contains('sidebar-mini')) {
        sidebarResponsive.classList.add('sidebar-mini', 'on-resize')
      }
    }
  } else {
    Array.from(tabs, (elem) => {
      if (elem.classList.contains('on-resize')) {
        elem.classList.remove('flex-column', 'on-resize');
      }
    })
    if (sidebarResponsive !== null) {
      if (sidebarResponsive.classList.contains('sidebar-mini') && sidebarResponsive.classList.contains('on-resize')) {
        sidebarResponsive.classList.remove('sidebar-mini', 'on-resize')
      }
    }
  }
}


/*---------------------------------------------------------------------
              LoaderInit
-----------------------------------------------------------------------*/

const loaderInit = () => {
  const loader = document.querySelector('.loader')
  setTimeout(() => {
    loader.classList.add('animate__animated', 'animate__fadeOut')
    setTimeout(() => {
      loader.classList.add('d-none')
    }, 500)
  }, 500)
}

/*---------------------------------------------------------------------
              Sidebar Toggle
-----------------------------------------------------------------------*/
const sidebarToggle = (elem) => {
  elem.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar')
    if (sidebar.classList.contains('sidebar-mini')) {
      sidebar.classList.remove('sidebar-mini')
    } else {
      sidebar.classList.add('sidebar-mini')
    }
  })
}

const sidebarToggleBtn = document.querySelectorAll('[data-toggle="sidebar"]')
const sidebar = document.querySelector('.sidebar-default')
if (sidebar !== null) {
  const sidebarActiveItem = sidebar.querySelectorAll('.active')
  Array.from(sidebarActiveItem, (elem) => {
    if (!elem.closest('ul').classList.contains('iq-main-menu')) {
      const childMenu = elem.closest('ul')
      childMenu.classList.add('show')
      const parentMenu = childMenu.closest('li').querySelector('.nav-link')
      parentMenu.classList.add('collapsed')
      parentMenu.setAttribute('aria-expanded', true)
    }
  })
}
Array.from(sidebarToggleBtn, (sidebarBtn) => {
  sidebarToggle(sidebarBtn)
})

/*------------------------
Back To Top
--------------------------*/
$('#back-to-top').fadeOut();
$(window).on("scroll", function () {
  if ($(this).scrollTop() > 250) {
    $('#back-to-top').fadeIn(1400);
  } else {
    $('#back-to-top').fadeOut(400);
  }
});
// scroll body to 0px on click
$('#top').on('click', function () {
  $('top').tooltip('hide');
  $('body,html').animate({
    scrollTop: 0
  }, 0);
  return false;
});

/*---------------------------------------------------------------------
              DOMContentLoaded
-----------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', (event) => {
  resizePlugins()
  loaderInit()
});

/*---------------------------------------------------------------------
              Window Resize
-----------------------------------------------------------------------*/

window.addEventListener('resize', function (event) {
  resizePlugins()
});

/*-------------------------------
| | | | | DropDown
--------------------------------*/

function darken_screen(yesno) {
  if (yesno == true) {
    document.querySelector('.screen-darken').classList.add('active');
  } else if (yesno == false) {
    document.querySelector('.screen-darken').classList.remove('active');
  }
}

function close_offcanvas() {
  darken_screen(false);
  document.querySelector('.mobile-offcanvas.show').classList.remove('show');
  document.body.classList.remove('offcanvas-active');
}

function show_offcanvas(offcanvas_id) {
  darken_screen(true);
  document.getElementById(offcanvas_id).classList.add('show');
  document.body.classList.add('offcanvas-active');
}

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll('[data-trigger]').forEach(function (everyelement) {
    let offcanvas_id = everyelement.getAttribute('data-trigger');
    everyelement.addEventListener('click', function (e) {
      e.preventDefault();
      show_offcanvas(offcanvas_id);
    });
  });
  if (document.querySelectorAll('.btn-close')) {
    document.querySelectorAll('.btn-close').forEach(function (everybutton) {
      everybutton.addEventListener('click', function (e) {
        close_offcanvas();
      });
    });
  }
  if (document.querySelector('.screen-darken')) {
    document.querySelector('.screen-darken').addEventListener('click', function (event) {
      close_offcanvas();
    });
  }
});
if (document.querySelector('#navbarSideCollapse')) {
  document.querySelector('#navbarSideCollapse').addEventListener('click', function () {
    document.querySelector('.offcanvas-collapse').classList.toggle('open')
  })
}

/*---------------------------------------------------------------------
    Fieldset
-----------------------------------------------------------------------*/

$(document).ready(function () {
  var e, t, a, n, o = 1,
    r = $("fieldset").length;

  function i(e) {
    var t = parseFloat(100 / r) * e;
    t = t.toFixed(), $(".progress-bar").css("width", t + "%")
  }
  i(o), $(".next").click(function () {
    e = $(this).parent(), t = $(this).parent().next(), $("#top-tab-list li").eq($("fieldset").index(t)).addClass("active"), $("#top-tab-list li").eq($("fieldset").index(e)).addClass("done"), t.show(), e.animate({
      opacity: 0
    }, {
      step: function (a) {
        n = 1 - a, e.css({
          display: "none",
          position: "relative"
        }), t.css({
          opacity: n
        })
      },
      duration: 500
    }), i(++o)
  }), $(".previous").click(function () {
    e = $(this).parent(), a = $(this).parent().prev(), $("#top-tab-list li").eq($("fieldset").index(e)).removeClass("active"), $("#top-tab-list li").eq($("fieldset").index(a)).removeClass("done"), a.show(), e.animate({
      opacity: 0
    }, {
      step: function (t) {
        n = 1 - t, e.css({
          display: "none",
          position: "relative"
        }), a.css({
          opacity: n
        })
      },
      duration: 500
    }), i(--o)
  }), $(".submit").click(function () {
    return !1
  })
}), $(document).ready(function () {
  var e = $("div.setup-panel div a"),
    t = $(".setup-content"),
    a = $(".nextBtn");
  t.hide(), e.click(function (a) {
    a.preventDefault();
    var n = $($(this).attr("href")),
      o = $(this);
    o.hasClass("disabled") || (e.addClass("active"), o.parent().addClass("active"), t.hide(), n.show(), n.find("input:eq(0)").focus())
  }), a.click(function () {
    var e = $(this).closest(".setup-content"),
      t = e.attr("id"),
      a = $('div.setup-panel div a[href="#' + t + '"]').parent().next().children("a"),
      n = e.find("input[type='text'],input[type='email'],input[type='password'],input[type='url'],textarea"),
      o = !0;
    $(".form-group").removeClass("has-error");
    for (var r = 0; r < n.length; r++) n[r].validity.valid || (o = !1, $(n[r]).closest(".form-group").addClass("has-error"));
    o && a.removeAttr("disabled").trigger("click")
  }), $("div.setup-panel div a.active").trigger("click")
}), $(document).ready(function () {
  var e, t, a, n, o = 1,
    r = $("fieldset").length;

  function i(e) {
    var t = parseFloat(100 / r) * e;
    t = t.toFixed(), $(".progress-bar").css("width", t + "%")
  }
  i(o), $(".next").click(function () {
    e = $(this).parent(), t = $(this).parent().next(), $("#top-tabbar-vertical li").eq($("fieldset").index(t)).addClass("active"), t.show(), e.animate({
      opacity: 0
    }, {
      step: function (a) {
        n = 1 - a, e.css({
          display: "none",
          position: "relative"
        }), t.css({
          opacity: n
        })
      },
      duration: 500
    }), i(++o)
  }), $(".previous").click(function () {
    e = $(this).parent(), a = $(this).parent().prev(), $("#top-tabbar-vertical li").eq($("fieldset").index(e)).removeClass("active"), a.show(), e.animate({
      opacity: 0
    }, {
      step: function (t) {
        n = 1 - t, e.css({
          display: "none",
          position: "relative"
        }), a.css({
          opacity: n
        })
      },
      duration: 500
    }), i(--o)
  }), $(".submit").click(function () {
    return !1
  })
}), $(document).ready(function () {
  $(".file-upload").on("change", function () {
    ! function (e) {
      if (e.files && e.files[0]) {
        var t = new FileReader;
        t.onload = function (e) {
          $(".profile-pic").attr("src", e.target.result)
        }, t.readAsDataURL(e.files[0])
      }
    }(this)
  }), $(".upload-button").on("click", function () {
    $(".file-upload").click()
  })
}), $(function () {
  function e(e) {
    return e / 100 * 360
  }
  $(".progress-round").each(function () {
    var t = $(this).attr("data-value"),
      a = $(this).find(".progress-left .progress-bar"),
      n = $(this).find(".progress-right .progress-bar");
    t > 0 && (t <= 50 ? n.css("transform", "rotate(" + e(t) + "deg)") : (n.css("transform", "rotate(180deg)"), a.css("transform", "rotate(" + e(t - 50) + "deg)")))
  })
});

/*---------------------------------------------------------------------
Form Validation
-----------------------------------------------------------------------*/

// Example starter JavaScript for disabling form submissions if there are invalid fields
window.addEventListener('load', function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);


/*---------------------------------------------------------------------
                 Logica de negocio (Panel de Control)
-----------------------------------------------------------------------*/
//
async function cargarDatosCrypto(symbol, nombre, img) {
  try {
    // usamos tu backend, no directo (evita CORS)
    const response = await fetch(`http://localhost:4000/api/crypto/${symbol}`);
    const data = await response.json();

    if (!data || !data.data || !data.data[symbol]) {
      throw new Error("Respuesta inesperada de la API");
    }

    const info = data.data[symbol]; // 👈 objeto completo de la moneda
    const quote = info.quote?.USD || {}; // 👈 métricas en USD
    document.getElementById("crypto-stats").innerHTML = `
  <div class="row text-center align-items-center">
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value text-warning">$${quote.price ? quote.price.toFixed(2) : "N/A"}</div>
      <div class="crypto-label">Precio actual</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value ${quote.percent_change_24h >= 0 ? "text-success" : "text-danger"}">
        ${quote.percent_change_24h ? quote.percent_change_24h.toFixed(2) : "N/A"}%
      </div>
      <div class="crypto-label">Cambio 24h</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value ${quote.percent_change_7d >= 0 ? "text-success" : "text-danger"}">
        ${quote.percent_change_7d ? quote.percent_change_7d.toFixed(2) : "N/A"}%
      </div>
      <div class="crypto-label">Cambio 7d</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">$${quote.volume_24h ? quote.volume_24h.toFixed(0) : "N/A"}</div>
      <div class="crypto-label">Volumen 24h</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">$${quote.market_cap ? quote.market_cap.toFixed(0) : "N/A"}</div>
      <div class="crypto-label">Market Cap</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">${quote.market_cap_dominance ? quote.market_cap_dominance.toFixed(2) : "N/A"}%</div>
      <div class="crypto-label">Dominancia</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">${info.max_supply ? info.max_supply.toLocaleString() : "∞"}</div>
      <div class="crypto-label">Max Supply</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">$${quote.open_24h ? quote.open_24h.toFixed(2) : "N/A"}</div>
      <div class="crypto-label">Apertura 24h</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">$${quote.high_24h ? quote.high_24h.toFixed(2) : "N/A"} / $${quote.low_24h ? quote.low_24h.toFixed(2) : "N/A"}</div>
      <div class="crypto-label">Rango 24h</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">${info.circulating_supply ? info.circulating_supply.toLocaleString() : "N/A"}</div>
      <div class="crypto-label">Circulating Supply</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">${info.cmc_rank ? info.cmc_rank : "N/A"}</div>
      <div class="crypto-label">Ranking global</div>
    </div>
    <div class="col-md-2 crypto-stat">
      <div class="crypto-value">$${quote.fully_diluted_market_cap ? quote.fully_diluted_market_cap.toFixed(0) : "N/A"}</div>
      <div class="crypto-label">FD Market Cap</div>
    </div>
  </div>
`;

    // actualizar nombre e imagen en el menú principal
    document.getElementById("nombreMoneda").innerText = nombre;
    const imgTag = document.querySelector("#dropdownMoneda img");
    if (imgTag) imgTag.setAttribute("src", img);


    // 🟢 Aquí renderizamos la card dinámicamente
    document.getElementById("crypto-card-container").innerHTML =
      renderCryptoCard(symbol, info, quote);


  } catch (error) {
    console.error("Error al cargar datos de CoinMarketCap:", error);
  }
}

// evento al hacer click en una opción del menú
document.querySelectorAll(".dropdown-item.moneda").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const simbolo = item.getAttribute("data-simbolo");
    const nombre = item.innerText.trim();
    const img = item.querySelector("img").getAttribute("src");
    cargarDatosCrypto(simbolo, nombre, img);
  });
});

// cargar Litecoin por defecto al inicio
cargarDatosCrypto("LTC", "Litecoin", "../assets/images/coins/06.png");


function renderCryptoCard(symbol, info, quote) {
  return `
    <div class="card shining-card">
      <div class="card-body">
        <img src="../assets/images/coins/01.png"
          class="img-fluid avatar avatar-50 avatar-rounded" alt="${symbol}">
        <span class="fs-5 me-2">${symbol}/USDT</span>
        <svg width="36" height="35" viewBox="0 0 36 35" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.86124 21.6224L11.2734 16.8577C11.6095 16.6417 12.041 16.6447 12.3718 16.8655L18.9661 21.2663C19.2968 21.4871 19.7283 21.4901 20.0644 21.2741L27.875 16.2534"
            stroke="#BFBFBF" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M26.7847 13.3246L31.6677 14.0197L30.4485 18.7565L26.7847 13.3246ZM30.2822 19.4024C30.2823 19.4023 30.2823 19.4021 30.2824 19.402L30.2822 19.4024ZM31.9991 14.0669L31.9995 14.0669L32.0418 13.7699L31.9995 14.0669C31.9994 14.0669 31.9993 14.0669 31.9991 14.0669Z"
            fill="#BFBFBF" stroke="#BFBFBF" />
        </svg>
        <div class="pt-3">
          <h4 class="counter" style="visibility: visible;">
            $${quote.price ? quote.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}
          </h4>
          <div class="pt-3">
            <small class="${quote.percent_change_24h >= 0 ? "text-success" : "text-danger"}">
              ${quote.percent_change_24h ? quote.percent_change_24h.toFixed(2) : "N/A"}%
            </small>
          </div>
        </div>
      </div>
    </div>
  `;
}


async function cargarResumenCuenta() {
  try {
    const response = await fetch("http://localhost:4000/api/crypto/bitcoin");
    if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

    const data = await response.json();
    const symbols = Object.keys(data.data || {});
    if (symbols.length === 0) return;

    const crypto = data.data[symbols[0]];
    if (!crypto || !crypto.quote?.USD) return;

    // Solo actualizar si hay precio válido
    if (crypto.quote.USD.price != null) {
      const precioActual = crypto.quote.USD.price.toFixed(6);
      const cambioSemana = crypto.quote.USD.percent_change_7d.toFixed(2);
      const cambioMes = crypto.quote.USD.percent_change_30d.toFixed(2);

      document.getElementById("weekly-value").textContent = `$${precioActual}`;
      document.getElementById("weekly-change").textContent = `${cambioSemana > 0 ? "+" : ""}${cambioSemana}%`;
      document.getElementById("monthly-value").textContent = `$${precioActual}`;
      document.getElementById("monthly-change").textContent = `${cambioMes > 0 ? "+" : ""}${cambioMes}%`;
    }

  } catch (error) {
    console.error("Error cargando resumen:", error);
    // Solo poner valores por defecto si no había nada antes
    const weeklyValue = document.getElementById("weekly-value").textContent;
    if (!weeklyValue || weeklyValue === "$0") {
      document.getElementById("weekly-value").textContent = "$0";
      document.getElementById("weekly-change").textContent = "+0%";
      document.getElementById("monthly-value").textContent = "$0";
      document.getElementById("monthly-change").textContent = "-0%";
    }
  }
}

cargarResumenCuenta();


let comparisonChart;

const select1 = document.getElementById("crypto1");
const select2 = document.getElementById("crypto2");

// Función para cargar comparativa con monedas dinámicas
async function cargarComparativaCrypto(symbols = ["ETH", "LTC"]) {
  try {
    const seriesData = [];

    for (const symbol of symbols) {
      const response = await fetch(`http://localhost:4000/api/crypto/history/${symbol}`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) continue;

      const preciosOHLC = data.map(item => ({
        x: new Date(item.timestamp).getTime(),
        y: [item.open, item.high, item.low, item.close]
      }));

      seriesData.push({
        name: symbol,
        data: preciosOHLC
      });
    }

    const options = {
      chart: {
        type: 'candlestick',
        height: 400,
        toolbar: {
          show: true
        }
      },
      series: seriesData,
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      title: {
        text: symbols.join(" vs ") + " / USD",
        align: 'left'
      },
      tooltip: {
        shared: true
      }
    };

    if (comparisonChart) comparisonChart.destroy();
    comparisonChart = new ApexCharts(document.querySelector("#crypto-comparison-chart"), options);
    comparisonChart.render();

  } catch (error) {
    console.error("Error cargando comparativa:", error);
  }
}

// Función para actualizar gráfico según selección
function actualizarComparativa() {
  const crypto1 = select1.value;
  const crypto2 = select2.value;
  cargarComparativaCrypto([crypto1, crypto2]);
}

// Listeners para actualizar al cambiar selects
select1.addEventListener("change", actualizarComparativa);
select2.addEventListener("change", actualizarComparativa);

// Cargar gráfico al inicio
actualizarComparativa();


// Arreglo de monedas soportadas con descripciones en español
const monedas = [{
    symbol: "BTC",
    name: "Bitcoin",
    img: "01.png",
    descriptions: [
      "Bitcoin es la primera criptomoneda descentralizada creada en 2009.",
      "Se utiliza como reserva de valor y medio de intercambio digital.",
      "Permite transferencias rápidas sin intermediarios bancarios.",
      "Su oferta está limitada a 21 millones de monedas.",
      "Es conocida por su alta volatilidad y adopción global."
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    img: "03.png",
    descriptions: [
      "Ethereum es una plataforma de contratos inteligentes descentralizada.",
      "Permite crear aplicaciones (DApps) sobre su blockchain.",
      "Ether (ETH) es la moneda nativa utilizada para transacciones.",
      "Ha impulsado la revolución de los NFTs y finanzas descentralizadas.",
      "Su red permite ejecutar código sin censura ni intermediarios."
    ]
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    img: "06.png",
    descriptions: [
      "Litecoin es una criptomoneda creada como alternativa más rápida a Bitcoin.",
      "Sus transacciones son más rápidas y con comisiones más bajas.",
      "Se basa en un algoritmo diferente llamado Scrypt.",
      "Es ampliamente aceptada en comercios y plataformas de intercambio.",
      "Es conocida como la plata digital frente al oro digital de Bitcoin."
    ]
  },
  {
    symbol: "XMR",
    name: "Monero",
    img: "08.png",
    descriptions: [
      "Monero es una criptomoneda enfocada en privacidad y anonimato.",
      "Todas las transacciones son confidenciales y no rastreables.",
      "Utiliza firmas en anillo y direcciones ocultas para proteger usuarios.",
      "Ideal para quienes valoran la seguridad y privacidad financiera.",
      "Es ampliamente utilizada en la comunidad que prioriza anonimato."
    ]
  }
];



const historyList = document.getElementById("history-list");

// Función para cargar historial de una moneda
async function cargarHistory(symbol) {
  try {
    const response = await fetch(`http://localhost:4000/api/crypto/historyCard/${symbol}`);
    if (!response.ok) throw new Error(`Error en la API: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error cargando history ${symbol}:`, error);
    return [];
  }
}

// Función para actualizar historial con moneda aleatoria
async function actualizarHistorialRandom() {
  // Seleccionar moneda aleatoria
  const moneda = monedas[Math.floor(Math.random() * monedas.length)];

  const data = await cargarHistory(moneda.symbol);
  historyList.innerHTML = ""; // limpiar lista

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "d-flex align-items-center pt-3";

    // Aquí usamos la descripción correspondiente al índice
    const description = moneda.descriptions[index] || moneda.descriptions[0];

    li.innerHTML = `
        <div class="d-flex justify-content-between rounded-pill">
            <img src="../assets/images/coins/${item.img || moneda.img}" class="img-fluid avatar avatar-40 avatar-rounded" alt="${moneda.name}">
            <div class="ms-3 flex-grow-1">
                <h5 class="mb-2">${moneda.name}</h5>
                <p class="text-${item.priceChangeType} mb-2">${item.priceChange}</p>
                <p class="fs-6">${description}</p>
            </div>
            <div class="">
                <p>${item.date}</p>
            </div>
        </div>
    `;
    historyList.appendChild(li);
  });

}

// Ejecutar al cargar la página y luego cada minuto
actualizarHistorialRandom();
setInterval(actualizarHistorialRandom, 60000); // 60000 ms = 1 minuto



// Balance virtual
const balance = {
  BTC: 561.511,
  LTC: 200,
  ETH: 150,
  XMR: 50,
  BPL: 10000
};
let monedaSeleccionada = "BTC";
let monedaImg = "01.png";

// Precio simulado por moneda (BPL por unidad)
const precios = {
  BTC: 20000,
  LTC: 150,
  ETH: 1500,
  XMR: 250
};

// Inputs y botones
const inputEnviar = document.getElementById("inputEnviar");
const inputRecibir = document.getElementById("inputRecibir");
const inputTotal = document.getElementById("inputTotal");
const btnComprar = document.getElementById("btnComprar");
const btnVender = document.getElementById("btnVender");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const dropdownBtn = document.getElementById("dropdownMenuButton5");
const addonMoneda = document.getElementById("basic-addon3");

// Selección de moneda desde dropdown
// Selección de moneda desde dropdown
dropdownItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Si no tiene data-symbol o data-img, usar valores por defecto
    monedaSeleccionada = item.getAttribute("data-symbol") || "USD"; // 👈 por defecto USD
    monedaImg = item.getAttribute("data-img") || "01.png"; // 👈 por defecto 01.png

    // Validar balance (evita error si no existe la clave en balance)
    const valor = balance && balance[monedaSeleccionada] ?
      balance[monedaSeleccionada] :
      0;

    dropdownBtn.innerHTML = `
      <img src="../assets/images/coins/${monedaImg}" 
           class="img-fluid avatar avatar-30 avatar-rounded"> 
      ${Number(valor).toFixed(3)} ${monedaSeleccionada}
    `;

    addonMoneda.textContent = monedaSeleccionada;
  });
});


// Calcular total y BPL al escribir cantidad
inputEnviar.addEventListener("input", () => {
  const cantidad = parseFloat(inputEnviar.value) || 0;
  const total = cantidad * precios[monedaSeleccionada];
  inputRecibir.value = total.toFixed(6);
  inputTotal.value = total.toFixed(6);
});








async function cargarTabla() {
  try {
    const res = await fetch("http://localhost:4000/api/data/dataTable");
    const result = await res.json();

    console.log("Respuesta API tabla:", result);

    // Asegurar que sea array
    let cryptos = Array.isArray(result) ? result : [];
    cryptos = cryptos.slice(0, 5);

    console.log("Datos para tabla:", cryptos);

    const tbody = document.getElementById("crypto-table-body");
    tbody.innerHTML = "";

    cryptos.forEach((coin, index) => {
      const price = coin?.quotes?.USD?.price || 0;
      const change24h = coin?.quotes?.USD?.percent_change_24h || 0;
      const marketCap = coin?.quotes?.USD?.market_cap || 0;
      const volume24h = coin?.quotes?.USD?.volume_24h || 0;
      const supply = coin?.total_supply || 0;


      const tr = document.createElement("tr");
      tr.className = "white-space-no-wrap";

      tr.innerHTML = `
  <td>
    <img src="../assets/images/coins/${String(index + 1).padStart(2, '0')}.png" 
         class="img-fluid avatar avatar-30 avatar-rounded" alt="${coin.name}" />
    ${coin.name} (${coin.symbol})
    <a class="button btn-primary badge ms-2" type="button">Buy</a>
  </td>
  <td class="pe-2">$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
  <td class="${change24h < 0 ? "text-danger" : "text-success"}">
    ${change24h.toFixed(2)}%
  </td>
  <td>$${marketCap.toLocaleString()}</td>
  <td>$${volume24h.toLocaleString()}<br>
      <small class="ms-5">${supply.toLocaleString()} ${coin.symbol}</small>
  </td>
  <td class="ms-5">${supply.toLocaleString()} ${coin.symbol}</td>
  <td>
    <div class="d-flex justify-content-between">
      <div id="sparklinechart-${index + 1}"></div>
      <div class="dropdown ms-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20"
            id="dropdownMenuButton10" data-bs-toggle="dropdown"
            aria-expanded="false" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton10">
          <li><a class="dropdown-item" href="#">View Charts</a></li>
          <li><a class="dropdown-item" href="#">View Markets</a></li>
          <li><a class="dropdown-item" href="#">View Historical Data</a></li>
        </ul>
      </div>
    </div>
  </td>
`;


      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando tabla:", err);
  }
}

cargarTabla();


const input = document.getElementById("txtPregunta");
const button = document.getElementById("btnMensaje");
const messagesContainer = document.getElementById("messagesContainer");
const placeholder = document.getElementById("placeholder");

// función para agregar mensajes al chat
function addMessage(content, sender = "user") {
  if (placeholder) placeholder.remove(); // quitar texto inicial

  const bubble = document.createElement("div");
  bubble.style.margin = "6px 0";
  bubble.style.padding = "8px 12px";
  bubble.style.borderRadius = "12px";
  bubble.style.maxWidth = "75%";
  bubble.style.wordWrap = "break-word";

  if (sender === "user") {
    bubble.className = "ms-auto text-primary";
    bubble.style.alignSelf = "flex-end";
    bubble.style.backgroundColor = "#e8f0fe";
    bubble.textContent = "🙋‍♂️ Tú: " + content;
  } else {
    bubble.className = "me-auto text-dark";
    bubble.style.alignSelf = "flex-start";
    bubble.style.backgroundColor = "#f8f9fa";
    bubble.textContent = "🤖 Bot: " + content;
  }

  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  console.log("👉 Enviando mensaje:", userMessage);

  // mostrar mensaje del usuario
  addMessage(userMessage, "user");
  input.value = "";

  // mensaje temporal mientras responde el backend
  const thinkingBubble = document.createElement("div");
  thinkingBubble.style.margin = "6px 0";
  thinkingBubble.style.padding = "8px 12px";
  thinkingBubble.style.borderRadius = "12px";
  thinkingBubble.style.maxWidth = "75%";
  thinkingBubble.style.backgroundColor = "#fff3cd";
  thinkingBubble.textContent = "🤖 pensando...";
  messagesContainer.appendChild(thinkingBubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const res = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage
      }),
    });

    const data = await res.json();
    console.log("👉 Respuesta backend:", data);

    // eliminar burbuja de "pensando..."
    messagesContainer.removeChild(thinkingBubble);

    // usar la respuesta correcta del backend
    if (data.message && data.message.content) {
      addMessage(data.message.content, "bot");
    } else if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("⚠️ No recibí respuesta del modelo", "bot");
    }
  } catch (err) {
    console.error(err);
    messagesContainer.removeChild(thinkingBubble);
    addMessage("⚠️ Error al conectar con el servidor", "bot");
  }
}

// click en botón
button.addEventListener("click", sendMessage);

// enviar con Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});


let activoSeleccionado = "BTC"; // Por defecto

document.querySelectorAll(".dropdown-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Actualizamos la variable global, no redeclaramos
    activoSeleccionado = item.dataset.symbol || "USD";
    const imgSeleccionada = item.dataset.img || "01.png";

    // Obtener elementos destino
    const dropdownBtn = document.querySelector("#dropdownMenuButton5");
    const addonMoneda = document.querySelector("#basic-addon3");

    if (dropdownBtn) {
      dropdownBtn.innerHTML = `
            <img src="../assets/images/coins/${imgSeleccionada}" 
                 class="img-fluid avatar avatar-30 avatar-rounded" alt="img"> 
            ${activoSeleccionado}
         `;
    } else {
      console.warn("⚠️ No se encontró #dropdownMenuButton5 en el DOM");
    }

    if (addonMoneda) {
      addonMoneda.innerText = activoSeleccionado;
    } else {
      console.warn("⚠️ No se encontró #basic-addon3 en el DOM");
    }
  });
});



// acción comprar
document.getElementById("btnComprar").addEventListener("click", async () => {
  const cantidad = parseFloat(document.getElementById("inputEnviar").value);
  const usuario_id = localStorage.getItem("usuarioId"); // ← tomar del localStorage
  const tipo = "COMPRA";
  const precio_unitario = 25000; // Ejemplo, lo puedes calcular dinámico o traer de API

  if (!cantidad || cantidad <= 0) {
    Swal.fire("⚠️ Atención", "Ingresa una cantidad válida", "warning");
    return;
  }

  const body = {
    usuario_id,
    activo: activoSeleccionado,
    tipo,
    cantidad,
    precio_unitario
  };

  const res = await fetch("http://localhost:4000/api/transacciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.success) {
    Swal.fire("✅ Compra exitosa", `Se registró la compra de ${cantidad} ${activoSeleccionado}`, "success");
    document.getElementById("inputEnviar").value = "";
  } else {
    Swal.fire("❌ Error", data.error, "error");
  }
});

// acción vender
document.getElementById("btnVender").addEventListener("click", async () => {
  const cantidad = parseFloat(document.getElementById("inputEnviar").value);
  const usuario_id = localStorage.getItem("usuarioId"); // ← tomar del localStorage
  const tipo = "VENTA";
  const precio_unitario = 25000;

  if (!cantidad || cantidad <= 0) {
    Swal.fire("⚠️ Atención", "Ingresa una cantidad válida", "warning");
    return;
  }

  const body = {
    usuario_id,
    activo: activoSeleccionado,
    tipo,
    cantidad,
    precio_unitario
  };

  const res = await fetch("http://localhost:4000/api/transacciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.success) {
    Swal.fire("✅ Venta exitosa", `Se registró la venta de ${cantidad} ${activoSeleccionado}`, "success");
    document.getElementById("inputEnviar").value = "";
  } else {
    Swal.fire("❌ Error", data.error, "error");
  }
});

document.getElementById("analizarBtn").addEventListener("click", async () => {
  try {
    //  Recuperar usuario logueado del localStorage
    const usuario = localStorage.getItem("usuarioId");
    if (!usuario) {
      alert("No se encontró usuario logueado");
      return;
    }

    // Mostrar modal con spinner de cargando
    const modal = new bootstrap.Modal(document.getElementById("analisisModal"));
    document.getElementById("analisisContenido").innerHTML = `
      <div class="text-center my-3">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Analizando portafolio...</p>
      </div>
    `;
    modal.show();

    //  Llamada al backend
    const res = await fetch("http://localhost:4000/api/analizar-portafolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuarioId: usuario
      })
    });

    const data = await res.json();

    // ⚡ Renderizar datos en el modal
    let html = `
      <h6>📊 Rendimiento:</h6>
      <div class="table-responsive">
        <table class="table table-striped table-sm align-middle">
          <thead class="table-dark">
            <tr>
              <th>Activo</th>
              <th>Cantidad</th>
              <th>Precio Promedio</th>
              <th>Precio Actual</th>
              <th>Valor Invertido</th>
              <th>Valor Actual</th>
              <th>Ganancia</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
    `;

    let totalInvertido = 0;
    let totalActual = 0;

    data.rendimiento.forEach(r => {
      totalInvertido += Number(r.valorInvertido);
      totalActual += Number(r.valorActual);

      html += `
        <tr>
          <td>${r.activo}</td>
          <td>${r.cantidad}</td>
          <td>$${Number(r.precioPromedio).toLocaleString()}</td>
          <td>$${Number(r.precioActual).toLocaleString()}</td>
          <td>$${Number(r.valorInvertido).toLocaleString()}</td>
          <td>$${Number(r.valorActual).toLocaleString()}</td>
          <td class="${r.ganancia >= 0 ? "text-success" : "text-danger"}">
            $${Number(r.ganancia).toLocaleString()}
          </td>
          <td class="${r.ganancia >= 0 ? "text-success" : "text-danger"}">
            ${r.porcentaje}
          </td>
        </tr>
      `;
    });

    //  Cálculo del total
    const totalGanancia = totalActual - totalInvertido;
    const totalPorcentaje = totalInvertido > 0 ? ((totalGanancia / totalInvertido) * 100).toFixed(2) : 0;

    html += `
        <tr class="fw-bold table-info">
          <td>Total</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>$${totalInvertido.toLocaleString()}</td>
          <td>$${totalActual.toLocaleString()}</td>
          <td class="${totalGanancia >= 0 ? "text-success" : "text-danger"}">
            $${totalGanancia.toLocaleString()}
          </td>
          <td class="${totalGanancia >= 0 ? "text-success" : "text-danger"}">
            ${totalPorcentaje}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <h6 class="mt-3">🤖 Análisis:</h6>
  <p>${data.analisis}</p>
`;

    document.getElementById("analisisContenido").innerHTML = html;

  } catch (err) {
    console.error("❌ Error:", err);
    document.getElementById("analisisContenido").innerHTML =
      "<p class='text-danger'>❌ Error al obtener el análisis del portafolio.</p>";
    const modal = new bootstrap.Modal(document.getElementById("analisisModal"));
    modal.show();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    // Nombre en mayúsculas con saludo
    document.querySelector(".caption-title").textContent =
      "¡HOLA! " + usuario.nombre.toUpperCase();

    // Rol traducido
    const rolTexto = usuario.rol;
    document.querySelector(".caption-sub-title").textContent = rolTexto;
    // Seleccionamos el <li> del menú Usuarios
    // Seleccionamos los enlaces sensibles
    const editarUsuario = document.querySelector("a[href='../dashboard/app/user-add.html']");
    const listaUsuarios = document.querySelector("a[href='../dashboard/app/user-list.html']");

    if (usuario && usuario.rol === "Administrador") {
      // Habilitar enlaces para administradores
      [editarUsuario, listaUsuarios].forEach(link => {
        link.classList.remove("disabled");
        link.removeAttribute("aria-disabled");
        link.style.pointerEvents = "auto";
        link.style.opacity = "1";
      });
    } else {
      // Deshabilitar para otros roles
      [editarUsuario, listaUsuarios].forEach(link => {
        link.classList.add("disabled");
        link.setAttribute("aria-disabled", "true");
        link.style.pointerEvents = "none"; // no clickeable
        link.style.opacity = "0.5"; // visualmente deshabilitado
      });
    }
  }
});


document.getElementById("btnTransacciones").addEventListener("click", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userId = usuario ? usuario.id : null;

  if (!userId) {
    Swal.fire({
      icon: 'warning',
      title: 'No se encontró el usuario en sesión',
      text: 'Por favor inicia sesión de nuevo',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/transacciones/${userId}`);
    const data = await res.json();

    const tbody = document.querySelector("#tablaTransacciones tbody");
    tbody.innerHTML = "";

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${tx.id_transaccion}</td>
                    <td>${tx.activo}</td>
                    <td>${tx.tipo}</td>
                    <td>${tx.cantidad}</td>
                 <td>${tx.precio_unitario ? Number(tx.precio_unitario).toFixed(2) : "0.00"}</td>
                    <td>${new Date(tx.fecha).toLocaleString()}</td>
                `;
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay transacciones registradas</td></tr>`;
    }

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("modalTransacciones"));
    modal.show();
  } catch (err) {
    console.error("Error al obtener transacciones:", err);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron cargar las transacciones 🚨'
    });
  }
});