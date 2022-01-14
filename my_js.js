function t_store_init(recid, opts) {
    var rec = $("#rec" + recid), isSnippet;
    $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]) || t_store_initRouting();
    var el_store = rec.find(".js-store")
      , prodPopup = t_store_get_productPopup_html(recid, opts);
    el_store.append(prodPopup);
    var pageMode = $(".t-records").attr("data-tilda-mode");
    if (opts.isPublishedPage = "edit" !== pageMode && "preview" !== pageMode,
    opts.isPublishedPage && t_store_checkUrl(opts, recid),
    "" === opts.storepart)
        return rec.find(".js-store-grid-cont-preloader").hide(),
        void (opts.sidebar && rec.find(".t951__grid-cont").removeClass("t951__grid-cont_hidden"));
    setTimeout((function() {
        rec.find(".js-store-grid-cont-preloader").removeClass("t-store__grid-cont-preloader_hidden")
    }
    ), 1500);
    var customUrlParams = t_store_paramsToObj(recid, opts);
    if (customUrlParams[recid]) {
        var optsBasedOnURL = t_store_updateOptionsBasedOnUrl(opts, customUrlParams, recid);
        optsBasedOnURL && (opts = optsBasedOnURL,
        rec.on("controlsDrawn", (function() {
            t_store_filters_render_selected(opts, recid)
        }
        )))
    }
    if (opts.sidebar) {
        rec.on("controlsDrawn", (function() {
            t_store_filters_opts_sort(opts, recid)
        }
        ));
        var el_filterWrapper = rec.find(".js-store-parts-select-container"), el_sidebarWrapper;
        el_filterWrapper.find(".t951__sidebar").length || el_filterWrapper.prepend('<div class="t951__sidebar-wrapper"></div>')
    }
    var slice = 1;
    if (customUrlParams[recid] && customUrlParams[recid].page && (slice = Array.isArray(customUrlParams[recid].page) ? customUrlParams[recid].page.join("") : customUrlParams[recid].page),
    t_store_loadProducts("", recid, opts, slice),
    t_store_mobileHoriz_checkBtnVisibility(recid, opts),
    opts.isHorizOnMob) {
        var handIcon = t_store_get_handIcon_html(recid);
        rec.find(".js-store-grid-cont-preloader").before(handIcon)
    }
    $(window).bind("resize", t_throttle((function() {
        t_store_unifyCardsHeights(recid, opts),
        t_store_moveSearhSort(recid, opts),
        t_store_loadMoreBtn_display(recid),
        t_store_pagination_display(recid)
    }
    ))),
    rec.find(".t-store").bind("displayChanged", (function() {
        setTimeout((function() {
            t_store_unifyCardsHeights(recid, opts)
        }
        ))
    }
    ));
    try {
        opts.verticalAlignButtons && ($(window).bind("resize", t_throttle((function() {
            t_store_verticalAlignButtons(recid, opts)
        }
        ), 500)),
        rec.find(".t-store").bind("displayChanged", (function() {
            t_store_verticalAlignButtons(recid, opts)
        }
        )))
    } catch (e) {
        console.log("verticalAlignButtons error: " + e)
    }
}
function t_store_history_pushState(state, title, url) {
    void 0 !== history.pushState && window.history.pushState(state, title, url)
}
function t_store_productInit(recid, options, product) {
    var el_product = $("#rec" + recid + " .t-store__product-snippet.js-store-product");
    options.tabs && "" !== options.tabs ? t_store_tabs_initSnippet(recid, options, el_product, product) : t_store_initTextAndCharacteristics(el_product, product),
    $("body").trigger("twishlist_addbtn"),
    window.isSearchBot || setTimeout((function() {
        window.Tilda && "function" == typeof Tilda.sendEcommerceEvent && Tilda.sendEcommerceEvent("detail", [{
            id: "" + (product.id ? product.id : product.uid),
            uid: "" + product.uid,
            price: "" + (product.price_min ? product.price_min : product.price),
            sku: product.sku ? product.sku : "",
            name: product.title
        }])
    }
    ), 2500)
}
function t_store_tabs_init(recid, options, product, el_product, el_popup) {
    var tabs;
    el_product.find(".t-store__tabs").empty(),
    $.when(t_store_loadProductTabs(recid, options, product.uid)).done((function() {
        var tabsData = window.tStoreTabsList ? window.tStoreTabsList[product.uid] : null;
        tabsData && tabsData.length ? (t_store_drawProdPopup_drawTabs(recid, options, tabsData),
        t_store_tabs_handleOnChange(recid, el_product),
        t_store_initTextAndCharacteristics(el_popup, product)) : t_store_initTextAndCharacteristics(el_popup, product)
    }
    ))
}
function t_store_tabs_initSnippet(recid, opts, el_product, product) {
    var el_tabs = el_product.find(".t-store__tabs");
    if (el_tabs.length) {
        var tabDesign, isAccordion = "accordion" === opts.tabs, colors = t_store_getCustomColors(opts);
        if (el_tabs.find(".t-store__tabs__item").each((function(i) {
            var el_title = $(this).find(".t-store__tabs__item-title")
              , title = el_title.text().trim()
              , el_button = $(this).find(".t-store__tabs__item-button")
              , el_content = $(this).find(".t-store__tabs__content");
            $(this).attr("data-tab-title", t_store_escapeQuote(title)),
            el_button.attr("data-tab-title", t_store_escapeQuote(title)),
            0 === i && ($(this).addClass("t-store__tabs__item_active"),
            el_button.addClass("t-store__tabs__item-button_active"),
            $(this).find(".t-store__tabs__content").css("display", "block")),
            colors.titleColor && el_title.css("color", colors.titleColor),
            colors.descrColor && el_content.css("color", colors.descrColor);
            var closeIcon = t_store_tabs_closeIcon_getHtml(recid, opts);
            el_button.append(closeIcon)
        }
        )),
        el_tabs.find(".t-store__tabs__button").each((function(i) {
            var el_title = $(this).find(".t-store__tabs__button-title")
              , title = el_title.text().trim();
            $(this).attr("data-tab-title", t_store_escapeQuote(title)),
            0 === i && $(this).addClass("t-store__tabs__button_active"),
            colors.titleColor && el_title.css("color", colors.titleColor)
        }
        )),
        isAccordion)
            el_tabs.find(".t-store__tabs__list").prepend(t_store_tabs_accordionBorder_getStyle(recid, opts));
        else {
            var el_controls = el_tabs.find(".t-store__tabs__controls");
            el_controls.prepend(t_store_tabs_fade_getStyle(opts)),
            el_controls.prepend(t_store_tabs_tabBorder_getStyle(recid, opts))
        }
        el_tabs.removeClass("t-store__tabs_snippet"),
        el_tabs.addClass("t-col"),
        el_tabs.addClass("t-col_12"),
        t_store_tabs_handleOnChange(recid, el_product),
        t_store_initTextAndCharacteristics(el_product, product)
    } else
        t_store_initTextAndCharacteristics(el_product, product)
}
function t_store_initRouting() {
    window.onpopstate = function() {
        if (window.history.state && window.history.state.productData) {
            var productPopupData = window.history.state.productData, recid, opts, productObj, isRelevantsShow;
            t_store_openProductPopup(productPopupData.recid, productPopupData.opts, productPopupData.productObj, productPopupData.isRelevantsShow)
        }
    }
}
function t_store_verticalAlignButtons(recid, opts) {
    var rec = $("#rec" + recid), gridContainer;
    rec.find(".js-store-grid-cont").addClass("t-store__valign-buttons");
    var wrappers = rec.find(".js-store-grid-cont .t-store__card__textwrapper")
      , maxHeight = 0
      , itemsInRow = parseInt(opts.blocksInRow, 10)
      , mobileView = $(window).width() <= 480
      , tableView = $(window).width() <= 960 && $(window).width() > 480
      , mobileOneRow = !!($(window).width() <= 960 && rec.find(".js-store-grid-cont.t-store__grid-cont_mobile-one-row")[0])
      , mobileTwoItemsInRow = !!($(window).width() <= 480 && rec.find(".t-store__mobile-two-columns")[0]);
    mobileView && (itemsInRow = 1),
    tableView && (itemsInRow = 2),
    mobileTwoItemsInRow && (itemsInRow = 2),
    mobileOneRow && (itemsInRow = 999999);
    var i = 1
      , wrappersInRow = [];
    if ($.each(wrappers, (function(key, element) {
        element.style.height = "unset"
    }
    )),
    $.each(wrappers, (function(key, element) {
        1 === itemsInRow ? element.style.height = "auto" : (wrappersInRow.push(element),
        element.offsetHeight > maxHeight && (maxHeight = element.offsetHeight),
        $.each(wrappersInRow, (function(key, wrapper) {
            wrapper.style.height = maxHeight + "px"
        }
        )),
        i === itemsInRow && (i = 0,
        maxHeight = 0,
        wrappersInRow = []),
        i++)
    }
    )),
    opts.showRelevants) {
        var relevantWrappers = rec.find(".js-product-relevant .t-store__card__textwrapper")
          , relevantMaxHeight = 0
          , relevantWrappersInRow = [];
        $.each(relevantWrappers, (function(key, element) {
            element.style.height = "unset"
        }
        )),
        $.each(relevantWrappers, (function(key, element) {
            relevantWrappersInRow.push(element),
            element.offsetHeight > relevantMaxHeight && (relevantMaxHeight = element.offsetHeight),
            $.each(relevantWrappersInRow, (function(key, wrapper) {
                wrapper.style.height = relevantMaxHeight + "px"
            }
            ))
        }
        ))
    }
}
function t_store_hoverZoom_init(recid) {
    if (!window.isMobile) {
        var rec = $("#rec" + recid);
        try {
            rec.find("[data-hover-zoom]")[0] && (jQuery.cachedScript || (jQuery.cachedScript = function(url) {
                var options = {
                    dataType: "script",
                    cache: !0,
                    url: url
                };
                return jQuery.ajax(options)
            }
            ),
            $.cachedScript("https://static.tildacdn.com/js/tilda-hover-zoom-1.0.min.js").done((function(script, textStatus) {
                "success" == textStatus ? t_hoverZoom_init(recid) : console.log("Upload script error: " + textStatus)
            }
            )))
        } catch (e) {
            console.log("Zoom image init error: " + e.message)
        }
    }
}
function t_store_addStoreParts(recid, opts, storePartsArr) {
    var rec, el_store = $("#rec" + recid).find(".js-store");
    opts.storePartsArr = storePartsArr;
    var tabsHtml = t_store_get_storePartsControl_html(recid, opts);
    opts.sidebar ? el_store.find(".t951__sidebar-wrapper").prepend(tabsHtml) : el_store.find(".js-store-parts-select-container").prepend(tabsHtml),
    t_store_initStoreParts(recid, opts)
}
function t_store_initStoreParts(recid, opts) {
    var rec = $("#rec" + recid);
    rec.find(".js-store-parts-switcher").on("click", (function() {
        var params = window.tStoreCustomUrlParams || {}, el_hiddenInput, previousInputValue, prevControl, storeparttitle = $(this).text();
        if (rec.find(".t-active").removeClass("t-active"),
        $(this).addClass("t-active"),
        opts.filters || (opts.filters = {}),
        $(this).hasClass("t-store__parts-switch-btn-all"))
            opts.filters.storepartuid && delete opts.filters.storepartuid,
            previousInputValue = (el_hiddenInput = rec.find('.js-store-filter-opt[name="storepartuid"]')).val(),
            params[recid] && params[recid].storepartuid && params[recid].storepartuid.forEach((function(storepart) {
                var control;
                rec.find('.js-store-filter-opt-chb[data-filter-value="' + storepart.replace(/\\/g, "\\\\") + '"]').prop("checked", !1),
                t_store_filters_opts_chosenVal_hide(rec, storepart)
            }
            )),
            el_hiddenInput.val(""),
            params[recid].storepartuid = [],
            window.tStoreCustomUrlParams = params,
            t_store_updateUrlWithParams("delete", "storepartuid", storeparttitle, recid);
        else {
            if (opts.filters.storepartuid = [storeparttitle],
            rec.find(".js-store-filter").length > 0) {
                var controlType, el_control = rec.find('[data-filter-value="' + storeparttitle.replace(/\\/g, "\\\\") + '"]');
                if (el_control.length > 0)
                    switch ((previousInputValue = (el_hiddenInput = el_control.parents(".js-store-filter-item").find(".js-store-filter-opt")).val()) && ((prevControl = rec.find('[data-filter-value="' + previousInputValue + '"]')).prop("checked", !1),
                    prevControl.removeClass("active"),
                    t_store_filters_opts_chosenVal_hide(rec, previousInputValue)),
                    controlType = el_control.attr("type")) {
                    case "checkbox":
                        el_control.prop("checked", !0),
                        t_store_filters_opts_chosenVal_add(recid, storeparttitle, el_control),
                        t_store_filters_opts_checkboxes_changeHiddenInput(el_control, !0);
                        break;
                    case "selectbox":
                        el_control.addClass("active"),
                        t_store_filters_opts_chosenVal_add(recid, storeparttitle, el_control),
                        t_store_filters_opts_customSelect_changeHiddenInput(el_control)
                    }
                else
                    (previousInputValue = (el_hiddenInput = rec.find('.js-store-filter-opt[name="storepartuid"]')).val()) && ((prevControl = rec.find('[data-filter-value="' + previousInputValue + '"]')).prop("checked", !1),
                    prevControl.removeClass("active"),
                    t_store_filters_opts_chosenVal_hide(rec, previousInputValue),
                    el_hiddenInput.val(""))
            }
            t_store_updateUrlWithParams("update", "storepartuid", storeparttitle, recid)
        }
        opts.sidebar && t_store_filters_scrollStickyBar(rec),
        t_store_showLoadersForProductsList(recid, opts),
        t_store_loadProducts("", recid, opts),
        t_store_mobileHoriz_checkBtnVisibility(recid, opts),
        t_store_setActiveStorePart(recid)
    }
    ))
}
function t_store_setActiveStorePart(recid) {
    var rec = $("#rec" + recid)
      , params = window.tStoreCustomUrlParams;
    rec.find(".t-active").removeClass("t-active"),
    rec.find(".js-store-parts-switcher").each((function() {
        var isAllButton = $(this).hasClass("t-store__parts-switch-btn-all");
        if (params && params[recid]) {
            var partName = $(this).html().replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
              , parts = params[recid].storepartuid;
            parts && -1 !== parts.indexOf(partName) && $(this).addClass("t-active"),
            !parts && isAllButton && $(this).addClass("t-active")
        } else
            isAllButton && $(this).addClass("t-active")
    }
    ))
}
function t_store_showLoadersForProductsList(recid, opts) {
    var rec = $("#rec" + recid);
    rec.find(".t-store__card").addClass("t-store__card_hidden");
    var preloaderTimerId = setTimeout((function() {
        opts.sidebar ? rec.find(".t951__grid-cont").addClass("t951__grid-cont_hidden") : rec.find(".js-store-grid-cont").html(""),
        rec.find(".js-store-grid-cont-preloader").css({
            display: "",
            opacity: "0"
        }).animate({
            opacity: 1
        }, 200)
    }
    ), 1e3);
    rec.data("preloader-timeout", preloaderTimerId)
}
function t_store_loadProducts(method, recid, opts, slice, relevantsOpts) {
    window.tStoreProductsRequested = !0;
    var showRelevants = "relevants" === method, c = Date.now(), storepartuid = opts.storepart, isFirstSlice = !slice || 1 === parseInt(slice, 10), rec = $("#rec" + recid), gridContainer = showRelevants ? rec.find(".js-store-relevants-grid-cont") : rec.find(".js-store-grid-cont"), isT973 = "973" === rec.attr("data-record-type"), dataObj;
    showRelevants ? (dataObj = {
        storepartuid: storepartuid,
        productuid: relevantsOpts.currentProductUid,
        quantity: relevantsOpts.relevantsQuantity,
        method: relevantsOpts.relevantsMethod,
        sort: relevantsOpts.relevantsSort
    },
    rec.find(".t-store__relevants-grid-cont").css({
        opacity: 0
    })) : dataObj = {
        storepartuid: storepartuid,
        recid: recid,
        c: c
    },
    isFirstSlice && (dataObj.getparts = !0,
    dataObj.getoptions = !0),
    slice && (dataObj.slice = slice),
    opts.filters && (dataObj.filters = opts.filters),
    opts.sort && !showRelevants && (dataObj.sort = opts.sort),
    opts.size && opts.size > 0 && (dataObj.size = opts.size);
    var apiUrl = showRelevants ? "https://store.tildacdn.com/api/getrelevantproducts/" : "https://store.tildacdn.com/api/getproductslist/";
    opts.isPublishedPage || (dataObj.projectid = $(".t-records").attr("data-tilda-project-id"),
    apiUrl = showRelevants ? "https://tilda.cc/projects/store/getrelevantproducts/" : "https://tilda.cc/projects/store/getproductslist/");
    var ts = Date.now();
    $.ajax({
        type: "GET",
        url: apiUrl,
        data: dataObj,
        dataType: "text",
        success: function(data) {
            if (clearTimeout(rec.data("preloader-timeout")),
            rec.find(".js-store-grid-cont-preloader").hide(),
            opts.sidebar && rec.find(".t951__grid-cont").removeClass("t951__grid-cont_hidden"),
            isFirstSlice && gridContainer.html(""),
            "string" == typeof data && "{" !== data.substring(0, 1) && (-1 !== data.indexOf("ERROR:") || -1 !== data.indexOf("Wrong"))) {
                console.log("show error");
                var el_errorBox = t_store_get_errorBox(opts, data);
                return gridContainer.append(el_errorBox),
                void rec.find(".js-store-error-msg").fadeIn(200)
            }
            if ("" !== data) {
                var obj = {};
                try {
                    void 0 !== (obj = jQuery.parseJSON(data)).partlinks && (opts.linksSizeChart = obj.partlinks)
                } catch (e) {
                    console.log(data)
                }
                if ("object" == typeof obj) {
                    var productsArr = showRelevants ? obj.relevants : obj.products, loadMoreBtn;
                    if (obj.options && obj.options.length >= 1 && (window.tStoreOptionsList = obj.options),
                    t_store_process(productsArr, recid, opts, !!slice, showRelevants, obj),
                    obj.parts && obj.parts.length > 1 && 0 === rec.find(".js-store-parts-switcher").length && !opts.hideStoreParts && t_store_addStoreParts(recid, opts, obj.parts),
                    showRelevants || t_store_setActiveStorePart(recid, opts),
                    "y" !== obj.filter || opts.hideFilters) {
                        if (opts.sidebar && !showRelevants) {
                            var el_sidebar = rec.find(".t951__sidebar");
                            el_sidebar.addClass("t951__sidebar_empty");
                            var text = "RU" === window.tildaBrowserLang ? 'Пожалуйста, добавьте хотя бы один фильтр каталога для отображения боковой панели магазина. <a href="https://help-ru.tilda.cc/online-store-payments/filters" target="_blank" rel="nofollow noopener">Справка</a>' : 'Please <a href="https://help.tilda.cc/online-store-payments/filters" target="_blank" rel="nofollow noopener">add at least one catalog filter</a> to display the store sidebar';
                            el_sidebar.html('<span class="t-text t-text_xxs">' + text + "</span>")
                        }
                    } else
                        $.when(t_store_loadFilters(recid, opts)).done((function(data) {
                            if (data) {
                                var filterObject = t_store_parse_jsonData(data);
                                t_store_filters_init(recid, opts, filterObject),
                                showRelevants || t_store_filters_prodsNumber_update(rec, opts, obj)
                            }
                        }
                        ));
                    if (t_store_isQueryInAddressBar("tstore") && window.t_store__scrollToBlock) {
                        var hashArr = decodeURI(window.location.hash).split("/"), storeuidIndex = hashArr.indexOf("r") + 1, storeuid;
                        hashArr[storeuidIndex] == recid && (setTimeout((function() {
                            window.scrollTo(0, rec.offset().top)
                        }
                        ), 500),
                        window.t_store__scrollToBlock = null)
                    }
                    if ((loadMoreBtn = rec.find(".js-store-load-more-btn")).removeClass("t-btn_sending"),
                    obj.nextslice) {
                        var isMobileOneRow = gridContainer.has("t-store__grid-cont_mobile-one-row");
                        if (0 === loadMoreBtn.length) {
                            var loadMoreBtn = t_store_get_loadMoreBtn_html(rec, opts);
                            opts.sidebar ? rec.find(".t951__cont-w-filter").append(loadMoreBtn) : rec.find(".js-store-grid-cont").after(loadMoreBtn),
                            loadMoreBtn = rec.find(".js-store-load-more-btn")
                        }
                        loadMoreBtn.show(),
                        loadMoreBtn.off("click"),
                        loadMoreBtn.on("click", (function() {
                            window.tStoreProductsRequested || (loadMoreBtn.addClass("t-btn_sending"),
                            t_store_loadProducts("", recid, opts, obj.nextslice))
                        }
                        )),
                        isMobileOneRow && gridContainer.bind("scroll", t_throttle((function() {
                            if (!window.tStoreProductsRequested && $(window).width() < 960) {
                                var scrollWidth = gridContainer.get(0).scrollWidth, scrollLeft = gridContainer.scrollLeft(), outerWidth;
                                gridContainer.outerWidth() + scrollLeft + 20 > scrollWidth && "none" !== loadMoreBtn.css("display") && loadMoreBtn.click()
                            }
                        }
                        ), 200))
                    } else
                        showRelevants || (loadMoreBtn.hide(),
                        gridContainer.off("scroll"));
                    if (opts.showPagination && "on" === opts.showPagination && !showRelevants && t_store_pagination_draw(recid, opts, slice, obj.nextslice, obj.total),
                    window.isMobile && gridContainer.bind("scroll", t_throttle((function() {
                        void 0 === $(".t-records").attr("data-tilda-mode") && ("y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_onFuncLoad("t_lazyload_update", (function() {
                            t_lazyload_update()
                        }
                        )))
                    }
                    ), 200)),
                    showRelevants) {
                        rec.find(".t-store__relevants-grid-cont").css({
                            opacity: 1
                        });
                        var blocksInRowForRelevant = 4;
                        opts.relevants_slider && (productsArr.length > 4 || $(window).width() <= 960) && t_store_onFuncLoad("t_sldsInit", (function() {
                            t_sldsInit(recid + " .js-store-relevants-grid-cont")
                        }
                        ))
                    }
                    isT973 && !showRelevants && t_store_onFuncLoad("t_sldsInit", (function() {
                        t_sldsInit(recid + " .js-store-grid-cont")
                    }
                    )),
                    opts.verticalAlignButtons && t_store_verticalAlignButtons(recid, opts),
                    opts.verticalAlignButtons && ("complete" === document.readyState ? t_store_verticalAlignButtons(recid, opts) : $(window).on("load", (function() {
                        t_store_verticalAlignButtons(recid, opts)
                    }
                    ))),
                    t_store_onFuncLoad("t_animate__startAnimation", (function() {
                        t_animate__startAnimation()
                    }
                    )),
                    $("body").trigger("twishlist_addbtn"),
                    window.tStoreProductsRequested = !1
                }
            }
        },
        error: function(xhr) {
            var loadMoreBtn;
            rec.find(".js-store-load-more-btn").removeClass("t-btn_sending");
            var ts_delta = Date.now() - ts;
            0 == xhr.status && ts_delta < 100 && console.log("Request error (get store products). Please check internet connection..."),
            window.tStoreProductsRequested = !1
        },
        timeout: 25e3
    })
}
function t_store_loadOneProduct(recid, opts, curProdUid) {
    var c = Date.now(), storepartuid, dataObj = {
        storepartuid: opts.storepart,
        recid: recid,
        productuid: curProdUid,
        c: c
    };
    return $.ajax({
        type: "GET",
        url: "https://store.tildacdn.com/api/getproduct/",
        data: dataObj,
        dataType: "text",
        success: function(data) {
            console.log(data)
        },
        error: function() {
            console.log("Can't get product with uid = " + curProdUid + " in storepart = " + opts.storepart)
        },
        timeout: 25e3
    })
}
function t_store_loadProducts_byId(idArr, opts) {
    var c = Date.now()
      , dataObj = {
        productsuid: idArr,
        c: c
    }
      , apiUrl = "https://store.tildacdn.com/api/getproductsbyuid/";
    return void 0 !== opts && (opts.isPublishedPage || (dataObj.projectid = $(".t-records").attr("data-tilda-project-id"),
    apiUrl = "https://tilda.cc/projects/store/getproductsbyuid/")),
    $.ajax({
        type: "GET",
        url: apiUrl,
        data: dataObj,
        dataType: "text",
        success: function() {},
        error: function() {
            console.log("Can't get getproductsbyuid. Requesting idArr: "),
            console.log(idArr)
        },
        timeout: 25e3
    })
}
function t_store_loadFilters(recid, opts) {
    var c = Date.now(), storepartuid, dataObj = {
        storepartuid: opts.storepart,
        c: c
    }, apiUrl = "https://store.tildacdn.com/api/getfilters/";
    return opts.isPublishedPage || (dataObj.projectid = $(".t-records").attr("data-tilda-project-id"),
    apiUrl = "https://tilda.cc/projects/store/getfilters/"),
    $.ajax({
        type: "GET",
        url: apiUrl,
        data: dataObj,
        dataType: "text",
        success: function() {},
        error: function() {
            console.log("Can't get filters in storepart = " + opts.storepart)
        },
        timeout: 25e3
    })
}
function t_store_loadProductTabs(recid, opts, curProdUid) {
    var c = Date.now(), storepartuid, dataObj = {
        storepartuid: opts.storepart,
        recid: recid,
        productuid: curProdUid,
        c: c
    };
    opts.isPublishedPage || (dataObj.projectid = $(".t-records").attr("data-tilda-project-id"));
    var apiUrl = "https://store.tildacdn.com/api/getproducttabs/";
    return opts.isPublishedPage || (dataObj.projectid = $(".t-records").attr("data-tilda-project-id"),
    apiUrl = "https://tilda.cc/projects/store/getproducttabs/"),
    $.ajax({
        type: "GET",
        url: apiUrl,
        data: dataObj,
        dataType: "text",
        success: function(data) {
            "string" == typeof data && (data = JSON.parse(data)),
            "object" == typeof data ? (window.tStoreTabsList || (window.tStoreTabsList = {}),
            window.tStoreTabsList[data.productuid] = data.tabs) : console.log("Wrong tabs data format for product uid = " + curProdUid + " in storepart = " + opts.storepart)
        },
        error: function() {
            console.log("Can't get tabs for product uid = " + curProdUid + " in storepart = " + opts.storepart)
        },
        timeout: 25e3
    })
}
function t_store_parse_jsonData(data) {
    try {
        var obj = jQuery.parseJSON(data)
    } catch (e) {
        console.log(data)
    }
    if ("object" == typeof obj)
        return obj
}
function t_store_process(productsArr, recid, opts, isNextSlice, isRelevantsShow, obj) {
    var rec = $("#rec" + recid)
      , gridContainer = rec.find(".js-store-grid-cont")
      , isT973 = "973" === rec.attr("data-record-type");
    isRelevantsShow && (gridContainer = rec.find(".js-store-relevants-grid-cont"));
    var separator = t_store_get_horizSeparator_html(opts)
      , obj_products = {}
      , countProducts = gridContainer.find(".t-store__card").length;
    if (0 === productsArr.length) {
        var el_emptyMsg = t_store_get_emptyMsg_html(opts);
        return gridContainer.append(el_emptyMsg),
        void rec.find(".js-store-empty-part-msg").fadeIn(200)
    }
    if (isRelevantsShow && opts.relevants_slider && opts.prodCard.shadowSize && opts.prodCard.shadowSize.length) {
        var paddingStyle = ""
          , size = parseInt(opts.prodCard.shadowSize, 10) > 10 ? 10 : parseInt(opts.prodCard.shadowSize, 10)
          , sizeHover = parseInt(opts.prodCard.shadowSizeHover, 10) > 40 ? 40 : parseInt(opts.prodCard.shadowSizeHover, 10)
          , maxSize = Math.max(sizeHover, size);
        paddingStyle += "<style>\n",
        paddingStyle += "    @media screen and (max-width:960px) {\n",
        paddingStyle += "        #rec" + recid + " .t-store .t-store__relevants__container .t-store__relevants-grid-cont .t-store__card__wrap_all {\n",
        paddingStyle += "            margin: " + size + "px;\n",
        paddingStyle += "        }\n",
        paddingStyle += "    }\n",
        paddingStyle += "    @media screen and (min-width:961px) {\n",
        paddingStyle += "        #rec" + recid + " .t-store .t-store__relevants__container .t-store__relevants-grid-cont .t-slds__items-wrapper {\n",
        paddingStyle += "            padding-top: " + maxSize + "px;\n",
        paddingStyle += "            padding-bottom: " + maxSize + "px;\n",
        paddingStyle += "        }\n",
        paddingStyle += "        #rec" + recid + " .t-store .t-store__relevants__container .t-store__relevants__title-wrapper .t-store__relevants__title {\n",
        paddingStyle += "            margin-bottom: " + (40 - maxSize) + "px;\n",
        paddingStyle += "        }\n",
        paddingStyle += "    }\n",
        paddingStyle += "</style>",
        rec.find(".t-popup .t-store__relevants__container").before(paddingStyle)
    }
    var productsHtml = ""
      , blocksInRowForRelevant = 4
      , blocksInRow = isRelevantsShow ? 4 : opts.blocksInRow;
    if (isRelevantsShow && opts.relevants_slider && (productsArr.length > 4 || $(window).width() <= 960) || !isRelevantsShow && isT973) {
        var animationduration = ""
          , animationspeed = "300";
        "fast" === opts.slider_opts.anim_speed && (animationduration = "t-slds_animated-fast"),
        "slow" === opts.slider_opts.anim_speed && (animationduration = "t-slds_animated-slow",
        animationspeed = "500"),
        productsHtml += '<div class="t-slds" style="visibility: hidden;">',
        productsHtml += '<div class="t-slds__main t-container">',
        productsHtml += '<div class="t-slds__container">',
        productsHtml = (productsHtml += '<div class="t-slds__items-wrapper ' + animationduration + '" data-slider-items-in-row="' + (!isRelevantsShow && isT973 ? blocksInRow : 4) + '" data-slider-transition="' + animationspeed + '" data-slider-with-cycle="true" data-slider-cycle="yes" data-slider-correct-height="' + (!isRelevantsShow && isT973 ? "true" : "false") + '" data-auto-correct-mobile-width="false">').replace("[[noCycleClass]]", opts.slider_opts.cycle ? "" : "t-slds__nocycle").replace("[[isCycled]]", opts.slider_opts.cycle ? "true" : "false")
    }
    if ($.each(productsArr, (function(i, product) {
        var minPrice = null
          , maxPrice = null;
        t_store_onFuncLoad("t_prod__cleanPrice", (function() {
            product.editions.forEach((function(edition) {
                if (edition.price && "" !== edition.price) {
                    var price = t_prod__cleanPrice(edition.price);
                    minPrice = null === minPrice ? price : Math.min(minPrice, price),
                    maxPrice = null === maxPrice ? price : Math.max(maxPrice, price)
                }
            }
            ))
        }
        )),
        product.minPrice = minPrice,
        product.maxPrice = maxPrice
    }
    )),
    $.each(productsArr, (function(i, product) {
        (!isRelevantsShow && !isT973 || isRelevantsShow && !opts.relevants_slider) && countProducts > 0 && countProducts % blocksInRow == 0 && (productsHtml += separator),
        productsHtml += t_store_get_productCard_html(rec, product, opts, isRelevantsShow, recid, i, productsArr),
        obj_products[product.uid] = product,
        countProducts++
    }
    )),
    isRelevantsShow && opts.relevants_slider && (productsArr.length > 4 || $(window).width() <= 960) || !isRelevantsShow && isT973) {
        var arrowsTplEl, arrowsTpl = rec.find(".js-store-tpl-slider-arrows").html();
        if (productsHtml += "</div>",
        productsHtml += "</div>",
        arrowsTpl && !isRelevantsShow && isT973 && (productsHtml += arrowsTpl,
        gridContainer.removeClass("t-container").removeClass("t-store__grid-cont_mobile-grid")),
        !isRelevantsShow && isT973) {
            var strBullets = '<div class="t-slds__bullet_wrapper">';
            $.each(productsArr, (function(i) {
                var key = i + 1;
                strBullets += '<div class="t-slds__bullet' + (1 === key ? " t-slds__bullet_active" : "") + '" data-slide-bullet-for="' + key + '"><div class="t-slds__bullet_body" style="background-color: transparent;"></div></div>'
            }
            )),
            productsHtml += strBullets += "</div>"
        }
        productsHtml += "</div>",
        productsHtml += "</div>",
        arrowsTpl && isRelevantsShow && (productsHtml += arrowsTpl)
    }
    if (t_store_process_appendAndShowProducts(rec, gridContainer, productsHtml),
    $.each(productsArr, (function(key, product) {
        var el_product = isRelevantsShow ? rec.find('.t-store__relevants__container .js-product.t-item[data-product-gen-uid="' + product.uid + '"]') : rec.find('.t-store__grid-cont .js-product.t-item[data-product-gen-uid="' + product.uid + '"]');
        el_product.data("cardSize", "small"),
        product = obj_products[product.uid],
        "both" !== opts.showStoreBtnQuantity && "list" !== opts.showStoreBtnQuantity || t_store_addProductQuantity(recid, el_product, product, opts),
        t_store_addProductOptions(recid, product, el_product, opts),
        t_store_option_handleOnChange_custom(recid, el_product, opts),
        t_store_onFuncLoad("t_prod__initProduct", (function() {
            t_prod__initProduct(recid, el_product)
        }
        ))
    }
    )),
    !isNextSlice && opts.isFlexCols && opts.isHorizOnMob && (gridContainer.find(".t-store__tail-gap").remove(),
    gridContainer.append('<div class="t-store__tail-gap"></div>')),
    "y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || (opts.relevants_slider ? setTimeout((function() {
        t_store_onFuncLoad("t_lazyload_update", (function() {
            t_lazyload_update()
        }
        ))
    }
    ), 100) : t_store_onFuncLoad("t_lazyload_update", (function() {
        t_lazyload_update()
    }
    ))),
    $(".t706__cartwin").length > 0 ? "function" == typeof tcart__addEvent__links && tcart__addEvent__links() : console.log("Warning: cart block is not added to this page"),
    t_store_initPopup(recid, obj_products, opts, isRelevantsShow, obj),
    t_store_unifyCardsHeights(recid, opts),
    opts.verticalAlignButtons && t_store_verticalAlignButtons(recid, opts),
    setTimeout((function() {
        t_store_unifyCardsHeights(recid, opts),
        opts.verticalAlignButtons && t_store_verticalAlignButtons(recid, opts)
    }
    ), 1),
    void 0 !== document.fonts ? void 0 !== document.fonts.ready && document.fonts.ready.then((function() {
        setTimeout((function() {
            t_store_unifyCardsHeights(recid, opts)
        }
        ), 1e3)
    }
    )) : setTimeout((function() {
        t_store_unifyCardsHeights(recid, opts)
    }
    ), 1e3),
    opts.verticalAlignButtons && ("complete" === document.readyState ? t_store_verticalAlignButtons(recid, opts) : $(window).on("load", (function() {
        t_store_verticalAlignButtons(recid, opts)
    }
    ))),
    !opts.previewmode)
        try {
            addEditFieldEvents_new(recid)
        } catch (e) {
            console.log(e.message)
        }
}
function t_store_process_appendAndShowProducts(rec, gridContainer, productsHtml) {
    gridContainer.append(productsHtml),
    !0 === rec.data("already-loaded-first-products") ? setTimeout((function() {
        rec.find(".t-store__card").removeClass("t-store__card_hidden")
    }
    ), 10) : (rec.find(".t-store__card").removeClass("t-store__card_hidden"),
    rec.data("already-loaded-first-products", !0))
}
function t_store_pagination_draw(recid, opts, curPage, nextSlice, total) {
    curPage = curPage ? Number(curPage) : 1;
    var PAGES_DRAW_COUNT = 5
      , pageSize = opts.size
      , totalPages = Math.ceil(total / pageSize)
      , pagingRange = t_store_pagination_getPagingRange(curPage, 1, totalPages, 5)
      , rec = $("#rec" + recid)
      , gridContainer = rec.find(".js-store-grid-cont")
      , loadmore = rec.find(".t-store__load-more-btn-wrap")
      , pagination = rec.find(".t-store__pagination");
    if (totalPages <= 1)
        pagination.remove();
    else {
        var html = t_store_pagination_getHtml(recid, opts, curPage, pagingRange, totalPages), pagination;
        pagination.length ? (pagination.empty(),
        pagination.append(html)) : loadmore.length ? loadmore.after(html) : gridContainer.after(html),
        (pagination = rec.find(".t-store__pagination")).attr("data-active-page", curPage),
        pagination.attr("data-total-pages", totalPages),
        t_store_pagination_addEvents(recid, opts),
        t_store_pagination_display(recid)
    }
}
function t_store_pagination_getHtml(recid, opts, curPage, pagingRange, totalPages) {
    var rec, pagination = $("#rec" + recid).find(".t-store__pagination"), str = "", addStyles = t_store_pagination_getButtonStyles(opts), descrColor, iconsColor = (opts.typo && opts.typo.descrColor && opts.typo.descrColor.length ? opts.typo.descrColor : null) || addStyles.bgColor || "#000000", separator = "...", prev = '<?xml version="1.0" encoding="UTF-8"?>    <svg class="t-store__pagination__arrow t-store__pagination__arrow_prev" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">            <path d="M5.85355339,3.14644661 C6.02711974,3.32001296 6.04640489,3.58943736 5.91140884,3.7843055 L5.85355339,3.85355339 L1.707,8 L15.5,8 C15.7761424,8 16,8.22385763 16,8.5 C16,8.74545989 15.8231248,8.94960837 15.5898756,8.99194433 L15.5,9 L1.707,9 L5.85355339,13.1464466 C6.02711974,13.320013 6.04640489,13.5894374 5.91140884,13.7843055 L5.85355339,13.8535534 C5.67998704,14.0271197 5.41056264,14.0464049 5.2156945,13.9114088 L5.14644661,13.8535534 L0.146446609,8.85355339 L0.108961015,8.81166225 L0.108961015,8.81166225 L0.0667474273,8.74976515 L0.0667474273,8.74976515 L0.0376105602,8.6905951 L0.0376105602,8.6905951 L0.0166108213,8.62813914 L0.0166108213,8.62813914 L0.00544806672,8.57406693 L0.00544806672,8.57406693 L0.00182199094,8.54281541 L0.00182199094,8.54281541 L0,8.48946265 C0.000554364655,8.46826702 0.00233820308,8.44709424 0.00546187104,8.42608223 L0,8.5 L0.00282096186,8.4465724 L0.00282096186,8.4465724 L0.0166082551,8.37185423 L0.0166082551,8.37185423 L0.0377922373,8.30896344 L0.0377922373,8.30896344 L0.0885911588,8.2156945 L0.0885911588,8.2156945 L0.134588748,8.15871357 L0.134588748,8.15871357 L5.14644661,3.14644661 C5.34170876,2.95118446 5.65829124,2.95118446 5.85355339,3.14644661 Z" fill="' + iconsColor + '" fill-rule="nonzero"></path>        </g>    </svg>', next = '<?xml version="1.0" encoding="UTF-8"?>    <svg class="t-store__pagination__arrow t-store__pagination__arrow_next" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">            <path d="M10.1464466,3.14644661 C9.97288026,3.32001296 9.95359511,3.58943736 10.0885912,3.7843055 L10.1464466,3.85355339 L14.293,8 L0.5,8 C0.223857625,8 0,8.22385763 0,8.5 C0,8.74545989 0.176875161,8.94960837 0.410124368,8.99194433 L0.5,9 L14.293,9 L10.1464466,13.1464466 C9.97288026,13.320013 9.95359511,13.5894374 10.0885912,13.7843055 L10.1464466,13.8535534 C10.320013,14.0271197 10.5894374,14.0464049 10.7843055,13.9114088 L10.8535534,13.8535534 L15.8535534,8.85355339 L15.891039,8.81166225 L15.891039,8.81166225 L15.9332526,8.74976515 L15.9332526,8.74976515 L15.9623894,8.6905951 L15.9623894,8.6905951 L15.9833892,8.62813914 L15.9833892,8.62813914 L15.9945519,8.57406693 L15.9945519,8.57406693 L16,8.5 L16,8.5 L15.997179,8.4465724 L15.997179,8.4465724 L15.9833917,8.37185423 L15.9833917,8.37185423 L15.9622078,8.30896344 L15.9622078,8.30896344 L15.9114088,8.2156945 L15.9114088,8.2156945 L15.8654113,8.15871357 L15.8654113,8.15871357 L10.8535534,3.14644661 C10.6582912,2.95118446 10.3417088,2.95118446 10.1464466,3.14644661 Z" fill="' + iconsColor + '" fill-rule="nonzero"></path>        </g>    </svg>', prevClass = t_store_pagination_getClass(opts, "t-store__pagination__item", "prev"), nextClass = t_store_pagination_getClass(opts, "t-store__pagination__item", "next"), separatorClass = t_store_pagination_getClass(opts, "t-store__pagination__item", "separator"), btnStyle = opts.typo.descr;
    addStyles.bgColor && (btnStyle += " border-color: " + addStyles.bgColor + ";"),
    addStyles.borderRadius && (btnStyle += " border-radius: " + addStyles.borderRadius + ";"),
    pagination.length || (str += '<div class="t-store__pagination" data-active-page="' + curPage + '" data-total-pages="' + totalPages + '">'),
    1 !== curPage && (str += '<div class="' + prevClass + '" style="' + btnStyle + '" data-control-type="prev">' + prev + "</div>");
    for (var last = pagingRange.length - 1, i = 0; i < pagingRange.length; i++) {
        var value = pagingRange[i], isActive, pageClass = t_store_pagination_getClass(opts, "t-store__pagination__item", "page", value === curPage);
        0 === i && 1 !== value && (str += '<div class="' + pageClass + '" style="' + btnStyle + '" data-page-num="1">1</div>'),
        0 === i && value > 2 && (str += '<div class="' + separatorClass + '" style="' + btnStyle + '">...</div>'),
        str += '<div class="' + pageClass + '" style="' + btnStyle + '" data-page-num="' + value + '">' + value + "</div>",
        i === last && pagingRange[last] < totalPages - 1 && (str += '<div class="' + separatorClass + '" style="' + btnStyle + '">...</div>'),
        i === last && pagingRange[last] !== totalPages && (str += '<div class="' + pageClass + '" style="' + btnStyle + '" data-page-num="' + totalPages + '">' + totalPages + "</div>")
    }
    return curPage < totalPages && (str += '<div class="' + nextClass + '" style="' + btnStyle + '" data-control-type="next">' + next + "</div>"),
    pagination.length || (str += "</div>"),
    str
}
function t_store_pagination_display(recid) {
    var rec = $("#rec" + recid), gridContainer = rec.find(".js-store-grid-cont"), pagination = rec.find(".t-store__pagination"), isMobileOneRow;
    gridContainer.length && pagination.length && (gridContainer.hasClass("t-store__grid-cont_mobile-one-row") && $(window).width() < 960 ? pagination.hide() : pagination.show())
}
function t_store_pagination_getClass(opts, className, type, isActive) {
    var sizeClass = "sm" === opts.btnSize ? "js-pagination-item_sm " : ""
      , result = "separator" === type ? className : "js-pagination-item " + sizeClass + className;
    return isActive && (result += " " + className + "_active"),
    result += " " + className + "_" + type,
    result += " t-descr t-descr_xxs"
}
function t_store_pagination_getButtonStyles(opts) {
    var addStyles = opts.btn1_style.split(";")
      , bgColor = null
      , borderRadius = null
      , result = {};
    if (addStyles.forEach((function(style) {
        0 === style.indexOf("background-color") ? bgColor = style.replace("background-color:", "").trim() : 0 === style.indexOf("border-radius") && (borderRadius = style.replace("border-radius:", "").trim())
    }
    )),
    bgColor) {
        result.bgColor = bgColor;
        var rgb = t_store_hexToRgb(bgColor);
        if (rgb) {
            var rgba = rgb;
            rgba.push(1),
            result.bgColorRgba = rgba
        }
    }
    return borderRadius && (result.borderRadius = borderRadius),
    result
}
function t_store_pagination_addEvents(recid, opts) {
    var rec = $("#rec" + recid)
      , buttons = rec.find(".js-pagination-item")
      , pagination = rec.find(".t-store__pagination")
      , addStyles = t_store_pagination_getButtonStyles(opts)
      , hoverColor = "rgba(0, 0, 0, 0.05)";
    if (addStyles.bgColorRgba) {
        var opacity = .05;
        addStyles.bgColorRgba[addStyles.bgColorRgba.length - 1] = .05,
        hoverColor = "rgba(" + addStyles.bgColorRgba.join(", ") + ")"
    }
    buttons.mouseenter((function() {
        $(this).css("background-color", hoverColor)
    }
    )).mouseleave((function() {
        $(this).css("background-color", "unset")
    }
    )),
    buttons.on("click", (function() {
        var button = $(this)
          , container = button.closest(".t-store__pagination")
          , pageNum = Number(button.attr("data-page-num"))
          , activePage = Number(container.attr("data-active-page"))
          , maxPage = Number(container.attr("data-total-pages"))
          , isNext = "next" === button.attr("data-control-type")
          , isPrev = "prev" === button.attr("data-control-type")
          , slice = pageNum;
        if ((isNaN(pageNum) || pageNum != activePage) && (isNext ? slice = activePage + 1 <= maxPage ? activePage + 1 : maxPage : isPrev ? slice = activePage - 1 >= 1 ? activePage - 1 : 1 : isNaN(pageNum) || (slice = pageNum),
        isNext || isPrev || !isNaN(pageNum))) {
            rec.find(".js-store-grid-cont").html(""),
            t_store_showLoadersForProductsList(recid, opts),
            t_store_loadProducts("", recid, opts, slice),
            pagination.attr("data-active-page", slice),
            pagination.attr("data-total-pages", maxPage),
            t_store_pagination_updateUrl(recid, opts, slice);
            var el_store = button.closest(".t-store");
            el_store.length && $("html, body").animate({
                scrollTop: el_store.offset().top - 50
            }, 50)
        }
    }
    ))
}
function t_store_pagination_updateUrl(recid, opts, slice) {
    var params = window.tStoreCustomUrlParams || {};
    params[recid] || (params[recid] = {}),
    params[recid].page = slice,
    1 == slice && delete params[recid].page,
    window.tStoreCustomUrlParams = params,
    t_store_paramsToObj_updateUrl(params)
}
function t_store_pagination_getPagingRange(current, min, total, length) {
    var result = [];
    length > total && (length = total);
    var start = current - Math.floor(length / 2);
    start = Math.max(start, min),
    start = Math.min(start, min + total - length);
    for (var i = 0; i < length; i++)
        result.push(start + i);
    return result
}
function t_store_mobileHoriz_checkBtnVisibility(recid, opts) {
    t_store_mobileHoriz_hideLoadBtn(recid, opts),
    $(window).bind("resize", t_throttle((function() {
        t_store_mobileHoriz_hideLoadBtn(recid, opts)
    }
    ), 500))
}
function t_store_mobileHoriz_hideLoadBtn(recid, opts) {
    var rec = $("#rec" + recid);
    $(window).width() < 960 && opts.hasMobileHorizScroll && rec.find(".js-store-load-more-btn").remove()
}
function t_store_get_storePartsControl_html(recid, opts) {
    var str = "";
    str += '<div class="t-store__parts-switch-wrapper t-align_center">',
    str += '<div class="js-store-parts-switcher t-store__parts-switch-btn t-name t-name_xs t-menu__link-item t-store__parts-switch-btn-all" data-storepart-link="#!/tstore/r/' + recid + "/c/" + opts.storepart + '" data-storepart-uid="' + opts.storepart + '" >',
    str += t_store_dict("all"),
    str += "</div>";
    for (var i = 0; i < opts.storePartsArr.length; i++) {
        var storePart = opts.storePartsArr[i];
        str += '<div class="js-store-parts-switcher t-store__parts-switch-btn t-name t-name_xs t-menu__link-item" data-storepart-link="#!/tstore/r/' + recid + "/c/" + storePart.uid + "-" + storePart.title + '" data-storepart-uid="' + storePart.uid + '">',
        str += "" + storePart.title,
        str += "</div>"
    }
    return str += "</div>"
}
function t_store_get_productPopup_html(recid, opts) {
    var str = "", statAttr = opts.popup_opts.popupStat ? 'data-track-popup="' + opts.popup_opts.popupStat + '"' : "", popupClass = "t-popup__container t-popup__container-static", verticalAlignButtons, verticalAlignClass = opts.verticalAlignButtons ? "t-store__valign-buttons" : "", showRelevants = opts.showRelevants, titleRelevants = opts.titleRelevants ? opts.titleRelevants : t_store_dict("seeAlso"), mobileOneRowClass = opts.relevants_slider ? "" : "t-store__grid-cont_mobile-one-row";
    opts.popup_opts.isVertical && (popupClass += " t-store__popup-container_8-cols");
    var popupStyle = opts.popup_opts.overlayBgColorRgba ? 'style="background-color:' + opts.popup_opts.overlayBgColorRgba + '"' : "", containerStyle = opts.popup_opts.containerBgColor ? 'style="background-color:' + opts.popup_opts.containerBgColor + '"' : "", sliderClass = opts.popup_opts.isVertical ? "" : "t-store__prod-popup__col-left t-col t-col_" + opts.popup_opts.columns, infoAlignClass, infoClass = "t-align_" + ("center" === opts.popup_opts.align ? "center" : "left") + " " + (opts.popup_opts.isVertical ? "" : "t-store__prod-popup__col-right t-col t-col_" + opts.popup_opts.columns2);
    return str += '<div class="t-popup" ' + statAttr + " " + popupStyle + ">",
    str += "    " + t_store_get_productPopup_closeIcon_html(opts),
    str += "    " + t_store_get_productPopup_closeText_html(opts),
    str += '    <div class="' + popupClass + '" ' + containerStyle + ">",
    str += "        <div>",
    str += '            <div class="t-store__prod-popup__container">',
    str += '                <div class="js-store-product js-product t-store__product-popup">',
    str += '                    <div class="t-store__prod-popup__slider js-store-prod-slider ' + sliderClass + '"></div>',
    str += '                    <div class="t-store__prod-popup__info ' + infoClass + '">',
    str += "                        " + t_store_get_productPopup_titleText_html(),
    str += '                        <div class="js-store-price-wrapper t-store__prod-popup__price-wrapper">',
    str += "                            " + t_store_get_productPopup_onePrice_html(opts, "current"),
    str += "                            " + t_store_get_productPopup_onePrice_html(opts, "old"),
    str += "                        </div>",
    str += '                        <div class="js-product-controls-wrapper"></div>',
    str += "                        " + t_store_get_productPopup_linksSizeChart_html(),
    str += "                        " + t_store_get_productPopup_buyBtn_html(opts),
    str += "                        " + t_store_get_productPopup_text_html(),
    str += "                    </div>",
    str += "                </div>",
    showRelevants && (str += '                <div class="t-store__relevants__container">',
    str += '                    <div class="t-store__relevants__title-wrapper">',
    str += '                        <div class="t-store__relevants__title t-uptitle t-uptitle_xxl" style="' + opts.typo.title + '">' + titleRelevants + "</div>",
    str += "                    </div>",
    opts.relevants_slider || (str += t_store_get_handIcon_html(recid)),
    str += '                    <div class="t-store__relevants-grid-cont js-store-relevants-grid-cont ' + verticalAlignClass + " " + mobileOneRowClass + '"></div>',
    str += "                </div>"),
    str += "            </div>",
    str += "        </div>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productPopup_text_html() {
    var str = "";
    return str += '<div class="js-store-prod-text t-store__prod-popup__text t-descr t-descr_xxs"></div>'
}
function t_store_get_productPopup_linksSizeChart_html() {
    var str = "";
    return str += '<div class="t-store__prod-popup__links-wrapper"></div>'
}
function t_store_get_productPopup_buyBtn_html(opts) {
    var str = ""
      , btnStyle = opts.btn1_style
      , btnTitle = opts.popup_opts.btnTitle;
    return "" !== btnTitle && (str += '<div class="t-store__prod-popup__btn-wrapper js-store-buttons-wrapper">',
    str += '<a href="#order" class="t-store__prod-popup__btn t-btn t-btn_sm" style="' + btnStyle + '">',
    str += '<table style="width:100%; height:100%;"><tr><td class="js-store-prod-popup-buy-btn-txt">',
    str += btnTitle,
    str += "</td></tr></table>",
    str += "</a>",
    str += "</div>"),
    str
}
function t_store_get_productPopup_onePrice_html(opts, type) {
    var str = ""
      , priceStylingClass = "current" === type ? "js-store-prod-price t-store__prod-popup__price" : "js-store-prod-price-old t-store__prod-popup__price_old"
      , styleAttr = ""
      , styleStr = ""
      , color = "current" === type ? opts.price.color : opts.price.colorOld;
    styleStr += color ? "color:" + color + ";" : "",
    styleAttr = "" !== (styleStr += opts.price.fontWeight ? "font-weight:" + opts.price.fontWeight + ";" : "") ? 'style = "' + styleStr + '"' : "";
    var currency = opts.currencyTxt ? '<div class="t-store__prod-popup__price-currency">' + opts.currencyTxt + "</div>" : ""
      , jsProdClass = "current" === type ? "js-product-price js-store-prod-price-val" : "js-store-prod-price-old-val";
    return str += '<div class="' + priceStylingClass + ' t-store__prod-popup__price-item t-name t-name_md" ' + styleAttr + ">",
    str += "r" !== opts.currencySide && currency ? currency : "",
    str += '    <div class="' + jsProdClass + ' t-store__prod-popup__price-value notranslate" translate="no"></div>',
    str += "r" === opts.currencySide && currency ? currency : "",
    str += "</div>"
}
function t_store_get_productPopup_titleText_html() {
    var str = "";
    return str += '<div class="t-store__prod-popup__title-wrapper">',
    str += '    <div class="js-store-prod-name js-product-name t-store__prod-popup__name t-name t-name_xl"></div>',
    str += '    <div class="t-store__prod-popup__brand t-descr t-descr_xxs"></div>',
    str += '    <div class="t-store__prod-popup__sku t-descr t-descr_xxs">',
    str += t_store_dict("sku") + ": ",
    str += '<span class="js-store-prod-sku js-product-sku">',
    str += "</span>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productPopup_closeIcon_html(opts) {
    var str = "", iconFillColor = opts.popup_opts.iconColor ? opts.popup_opts.iconColor : "#000000", bgColor = opts.popup_opts.overlayBgColorRgba ? t_store_removeRgbOpacity(opts.popup_opts.overlayBgColorRgba) : opts.popup_opts.containerBgColor, containerFillColor = bgColor && bgColor.length ? bgColor : "#ffffff", color;
    opts.popup_opts.overlayBgColorRgba && !opts.popup_opts.iconColor && (iconFillColor = t_store_luma_rgb(t_store_removeRgbOpacity(opts.popup_opts.overlayBgColorRgba)));
    return str += '<div class="t-popup__close" style="background-color: ' + containerFillColor + '">',
    str += '    <div class="t-popup__close-wrapper">',
    str += '<svg class="t-popup__close-icon t-popup__close-icon_arrow" width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
    str += '<path d="M10.4142136,5 L11.8284271,6.41421356 L5.829,12.414 L23.4142136,12.4142136 L23.4142136,14.4142136 L5.829,14.414 L11.8284271,20.4142136 L10.4142136,21.8284271 L2,13.4142136 L10.4142136,5 Z" fill="' + iconFillColor + '"></path>',
    str += "</svg>",
    str += '        <svg class="t-popup__close-icon t-popup__close-icon_cross" width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
    str += '            <g stroke="none" stroke-width="1" fill="' + iconFillColor + '" fill-rule="evenodd">',
    str += '                <rect transform="translate(11.313708, 11.313708) rotate(-45.000000) translate(-11.313708, -11.313708) " x="10.3137085" y="-3.6862915" width="2" height="30"></rect>',
    str += '                <rect transform="translate(11.313708, 11.313708) rotate(-315.000000) translate(-11.313708, -11.313708) " x="10.3137085" y="-3.6862915" width="2" height="30"></rect>',
    str += "            </g>",
    str += "        </svg>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productPopup_closeIcon_color(recid, opts) {
    var iconFillColor = opts.popup_opts.iconColor ? opts.popup_opts.iconColor : "#000000", bgColor = opts.popup_opts.overlayBgColorRgba ? t_store_removeRgbOpacity(opts.popup_opts.overlayBgColorRgba) : opts.popup_opts.containerBgColor, containerFillColor = bgColor && bgColor.length ? bgColor : "#ffffff", color;
    opts.popup_opts.overlayBgColorRgba && !opts.popup_opts.iconColor && (iconFillColor = t_store_luma_rgb(color = t_store_removeRgbOpacity(opts.popup_opts.overlayBgColorRgba)));
    var rec = $("#rec" + recid), isSnippet = $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]), wrapper = isSnippet ? rec.find(".t-store__prod-snippet__container") : rec.find(".t-popup"), el_close;
    wrapper.find(".t-popup__close").css("background-color", containerFillColor);
    var el_icon_cross = wrapper.find(".t-popup__close-icon_cross"), el_icon_arrow;
    if (isSnippet && !opts.popup_opts.iconColor || Math.abs(t_store_getLightnessColor(iconFillColor) - t_store_getLightnessColor(t_store_removeRgbOpacity(containerFillColor))) > .1) {
        var color = t_store_removeRgbOpacity(opts.popup_opts.containerBgColor) || "rgb(0,0,0)";
        el_icon_cross.find("g").attr("fill", t_store_luma_rgb(color))
    } else
        el_icon_cross.find("g").attr("fill", iconFillColor);
    wrapper.find(".t-popup__close-icon_arrow").find("path").attr("fill", iconFillColor)
}
function t_store_get_productPopup_closeText_html(opts) {
    if (!opts.popup_opts.closeText)
        return "";
    var closeRichText = t_store_unescapeHtml(opts.popup_opts.closeText), iconFillColor = opts.popup_opts.iconColor ? opts.popup_opts.iconColor : "#000000", containerFillColor = opts.popup_opts.containerBgColor && opts.popup_opts.containerBgColor.length ? opts.popup_opts.containerBgColor : "#ffffff", rgbColor;
    opts.popup_opts.containerBgColor && !opts.popup_opts.iconColor && (iconFillColor = t_store_luma_rgb(t_store_hexToRgb(containerFillColor)));
    var style, str = "";
    return str += '<div class="t-store__prod-popup__close-txt-wr">',
    str += '    <div class="js-store-close-text t-store__prod-popup__close-txt t-descr t-descr_xxs" ' + ('style="color:' + iconFillColor + '"') + ">",
    str += closeRichText,
    str += "    </div>",
    str += "</div>"
}
function t_store_get_loadMoreBtn_html(rec, opts) {
    var str = "", isMobileOneRow, className, btnSizeClass;
    return str += '<div class="t-store__load-more-btn-wrap t-align_center' + (!!($(window).width() < 960 && rec.find(".js-store-grid-cont.t-store__grid-cont_mobile-one-row")[0]) ? " t-store__load-more-btn-wrap_hidden " : "") + '">',
    str += '    <div class="js-store-load-more-btn t-store__load-more-btn t-btn ' + ("sm" === opts.btnSize ? "t-btn_xs" : "t-btn_sm") + '" style="' + opts.btn1_style + 'display:none;">',
    str += '        <table style="width:100%; height:100%;"><tr><td>' + t_store_dict("loadmore") + "</td></tr></table>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_handIcon_html(recid) {
    var str = "", rec, size = "42", cardFill = "rgba(190,190,190,0.3)", handFill = "rgba(190,190,190,1)", blendMode = "mix-blend-mode: multiply;", blockColor = $("#rec" + recid).attr("data-bg-color"), blockColorRGB, luma;
    if (blockColor && "white" === t_store_luma_rgb(t_store_hexToRgb(blockColor))) {
        var cardFill = "rgba(255,255,255,0.2)"
          , handFill = "rgba(255,255,255,1)";
        blendMode = "mix-blend-mode: lighten;"
    }
    return str += '<div class="t-store__scroll-icon-wrapper" style="' + blendMode + '">',
    str += '<?xml version="1.0" encoding="UTF-8"?>',
    str += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 300" height="42" width="42"> <rect class="tooltip-horizontal-scroll-icon_card" x="480" width="200" height="200" rx="5" fill="' + cardFill + '"></rect> <rect class="tooltip-horizontal-scroll-icon_card" y="0" width="200" height="200" rx="5" fill="' + cardFill + '"></rect> <rect class="tooltip-horizontal-scroll-icon_card" x="240" width="200" height="200" rx="5" fill="' + cardFill + '"></rect> <path class="tooltip-horizontal-scroll-icon_hand" d="M78.9579 285.7C78.9579 285.7 37.8579 212.5 20.5579 180.8C-2.44209 138.6 -6.2422 120.8 9.6579 112C19.5579 106.5 33.2579 108.8 41.6579 123.4L61.2579 154.6V32.3C61.2579 32.3 60.0579 0 83.0579 0C107.558 0 105.458 32.3 105.458 32.3V91.7C105.458 91.7 118.358 82.4 133.458 86.6C141.158 88.7 150.158 92.4 154.958 104.6C154.958 104.6 185.658 89.7 200.958 121.4C200.958 121.4 236.358 114.4 236.358 151.1C236.358 187.8 192.158 285.7 192.158 285.7H78.9579Z" fill="' + handFill + '"></path>',
    str += "<style> .tooltip-horizontal-scroll-icon_hand { animation: tooltip-horizontal-scroll-icon_anim-scroll-hand 2s infinite } .tooltip-horizontal-scroll-icon_card { animation: tooltip-horizontal-scroll-icon_anim-scroll-card 2s infinite } @keyframes tooltip-horizontal-scroll-icon_anim-scroll-hand { 0% { transform: translateX(80px) scale(1); opacity: 0 } 10% { transform: translateX(80px) scale(1); opacity: 1 } 20%,60% { transform: translateX(175px) scale(.6); opacity: 1 } 80% { transform: translateX(5px) scale(.6); opacity: 1 } to { transform: translateX(5px) scale(.6); opacity: 0 } } @keyframes tooltip-horizontal-scroll-icon_anim-scroll-card { 0%,60% { transform: translateX(0) } 80%,to { transform: translateX(-240px) } }",
    str += "</style>",
    str += "</svg>",
    str += "</div>"
}
function t_store_get_emptyMsg_html(opts) {
    var str = ""
      , styles = opts.typo.titleColor ? "color:" + opts.typo.titleColor + ";border-color:" + opts.typo.titleColor + ";" : ""
      , classStr = "js-store-empty-part-msg t-store__empty-part-msg-cont";
    return str += '<div class="' + (classStr += opts.colClassFullWidth ? " " + opts.colClassFullWidth : "") + '" style="display:none;">',
    str += '    <div class=" t-store__empty-part-msg-wrapper t-descr t-descr_sm" style="' + styles + '">',
    str += '        <div class="t-store__empty-part-msg">',
    str += "        " + t_store_dict("emptypartmsg"),
    str += "        </div>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_errorBox(opts, errorText) {
    var str = ""
      , styles = opts.typo.titleColor ? "color:" + opts.typo.titleColor + ";border-color:" + opts.typo.titleColor + ";" : ""
      , classStr = "js-store-error-msg t-store__error-msg-cont";
    return str += '<div class="' + (classStr += opts.colClassFullWidth ? " " + opts.colClassFullWidth : "") + '" style="display:none;">',
    str += '    <div class="t-store__error-msg-wrapper t-descr t-descr_sm" style="' + styles + '">',
    str += '        <div class="t-store__error-msg">',
    str += "        " + errorText,
    str += "        </div>",
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productCard_html(rec, product, opts, isRelevantsShow, recid, key, productsArr) {
    var colClass = isRelevantsShow ? "t-col t-col_3" : opts.colClass
      , edition = t_store_product_getFirstAvailableEditionData(product.editions)
      , str = ""
      , alignClass = "left" === opts.align ? "t-align_left" : "t-align_center"
      , animClass = opts.itemsAnim && opts.previewmode ? "t-animate" : "";
    if (window.isMobile) {
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        void 0 !== connection && ("slow-2g" !== connection.effectiveType && "2g" !== connection.effectiveType && "3g" !== connection.effectiveType || (animClass = ""))
    }
    var animAttr = opts.itemsAnim ? 'data-animate-style="' + opts.itemsAnim + '" data-animate-chain="yes" ' : ""
      , isSoldOut = edition.quantity && parseInt(edition.quantity, 10) <= 0
      , quantityAttr = 'data-product-inv="' + (edition.quantity || "") + '" '
      , url = t_store_get_productCard_link(opts.prodCard.btnLink1, product, isRelevantsShow, recid, rec)
      , linkTarget = t_store_get_productCard_targetAttr(opts.prodCard.btnLink1, product)
      , link = {
        open: opts.previewmode ? '<a href="' + url + '" ' + linkTarget + ">" : "",
        close: opts.previewmode ? "</a>" : ""
    };
    isSoldOut && "#order" === url && (link.open = "",
    link.close = "");
    var relevantsProductClass = "";
    isRelevantsShow && (relevantsProductClass = "js-product-relevant");
    var blocksInRowForRelevant = 4
      , pack_label = product.pack_label
      , pack_m = product.pack_m
      , pack_x = product.pack_x
      , pack_y = product.pack_y
      , pack_z = product.pack_z;
    key = parseInt(key, 10) + 1;
    var isT973MainSlider = "973" === rec.attr("data-record-type") && !isRelevantsShow
      , needRelevantsSlider = isRelevantsShow && opts.relevants_slider && (productsArr.length > 4 || $(window).width() <= 960);
    (needRelevantsSlider || isT973MainSlider) && (str += '<div class="t-slds__item t-animate" data-slide-index="' + key + '">',
    str += '<div class="t__slds-wrapper t-slds__wrapper t-slds__wrapper_100 t-align_center">');
    var productUrl = product.url || "";
    return str += '<div class="js-product t-store__card t-store__card_hidden ' + colClass + " " + alignClass + " " + relevantsProductClass + " t-item " + animClass + '" ' + animAttr + quantityAttr + 'data-product-lid="' + product.uid + '" data-product-uid="' + product.uid + '" data-product-gen-uid="' + product.uid + '" data-product-pack-label="' + pack_label + '" data-product-pack-m="' + pack_m + '" data-product-pack-x="' + pack_x + '" data-product-pack-y="' + pack_y + '" data-product-pack-z="' + pack_z + '" data-product-url="' + productUrl + '" >',
    str += opts.prodCard.hasWrap ? t_store_get_productCard_wrapperStructure(product, edition, opts, link, isRelevantsShow, recid, rec) : t_store_get_productCard_simpleStructure(product, edition, opts, link, isRelevantsShow, recid, rec),
    str += "</div>",
    (needRelevantsSlider || isT973MainSlider) && (str += "</div>",
    str += "</div>"),
    str
}
function t_store_get_productCard_simpleStructure(product, edition, opts, link, isRelevantsShow, recid, rec) {
    var controlsStyle = opts.prodCard.showOpts ? "" : 'style="display:none;"'
      , strImg = t_store_get_productCard_img_html(product, opts)
      , str = "";
    return str += link.open,
    str += "    " + t_store_get_productCard_txtAndPrice_html1(product, edition, opts, strImg),
    str += "    " + strImg,
    str += "    " + t_store_get_productCard_txtAndPrice_html(product, edition, opts, strImg),
    str += link.close,
    str += '<div class="js-product-controls-wrapper t-store__card__prod-controls-wrapper" ' + controlsStyle + "></div>",
    str += t_store_get_productCard_btn_html(product, edition, opts, isRelevantsShow, recid, rec)
}
function t_store_get_productCard_wrapperStructure(product, edition, opts, link, isRelevantsShow, recid, rec) {
    var str = "", wrapStyles = t_store_get_productCard_getWrapperStylesStr(opts), controlsStyle = opts.prodCard.showOpts ? "" : 'style="display:none;"', padClass;
    return str += '<div class="t-store__card__wrap_all ' + (opts.prodCard && opts.prodCard.txtPad ? "t-store__card__wrap_pad-" + opts.prodCard.txtPad : "") + '" style="' + wrapStyles + '">',
    str += "    " + link.open,
    str += "        " + t_store_get_productCard_img_html(product, opts),
    str += "    " + link.close,
    str += '    <div class="t-store__card__wrap_txt-and-btns">',
    str += '        <div class="store__card__wrap_txt-and-opts">',
    str += "            " + link.open,
    str += "                " + t_store_get_productCard_txtAndPrice_html(product, edition, opts),
    str += "            " + link.close,
    str += '            <div class="js-product-controls-wrapper t-store__card__prod-controls-wrapper" ' + controlsStyle + "></div>",
    str += "        </div>",
    str += "        " + t_store_get_productCard_btn_html(product, edition, opts, isRelevantsShow, recid, rec),
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productCard_getWrapperStylesStr(opts) {
    var str = "", isShadow;
    if (str += opts.prodCard.bgColor ? "background-color:" + opts.prodCard.bgColor + ";" : "",
    str += opts.prodCard.borderRadius ? "border-radius:" + parseInt(opts.prodCard.borderRadius, 10) + "px;" : "",
    !!(opts.prodCard.shadowOpacity && opts.prodCard.shadowOpacity.length || opts.prodCard.shadowSize && opts.prodCard.shadowSize.length)) {
        var opacity = opts.prodCard.shadowOpacity ? "0." + opts.prodCard.shadowOpacity : "0.3", size;
        str += "box-shadow: 0px 0px " + (opts.prodCard.shadowSize ? parseInt(opts.prodCard.shadowSize, 10) + "px" : "10px") + " 0px rgba(0, 0, 0, " + opacity + ");"
    }
    return str
}
function t_store_get_productCard_img_html(product, opts, curImage) {
    var str = "", mobileNoPaddingClass, wrapperClassStr = "t-store__card__imgwrapper " + (opts.hasOriginalAspectRatio && !opts.isHorizOnMob ? "t-store__card__imgwrapper_original-ratio" : "") + (opts.isFlexCols ? " " + opts.imageRatioClass : ""), wrapperStyle = opts.imageHeight && !opts.isFlexCols ? "padding-bottom:" + 100 * parseInt(opts.imageHeight, 10) / (opts.colWidth || 360) + "%;" : "";
    if (opts.hasOriginalAspectRatio && opts.prodCard.borderRadius) {
        var size = parseInt(opts.prodCard.borderRadius, 10);
        wrapperStyle += "border-radius:" + size + "px " + size + "px 0px 0px; overflow: hidden;"
    }
    var hoverImgEl = t_store_get_productCard_imgElHover_html(product, opts, curImage), hasHover = opts.imageHover && hoverImgEl, fieldAttrStrName = opts.hasOriginalAspectRatio ? "imgfield" : "bgimgfield", imgFieldAttr = 1 === product.editions.length ? fieldAttrStrName + '="st_gallery__' + product.uid + ':::0"' : "", imgEl, imgSrc = curImage || t_store_getProductFirstImg(product);
    if ("" !== imgSrc) {
        if (opts.hasOriginalAspectRatio)
            imgEl = "<img " + t_store_getLazySrc(opts, imgSrc) + ' class="js-product-img t-store__card__img ' + (hasHover ? "t-store__card__img_hover" : "") + ' t-img" ' + imgFieldAttr + "/>";
        else {
            var stylesStr = t_store_get_productCard_getImgStyles(opts);
            imgEl = '<div class="js-product-img t-store__card__bgimg ' + (hasHover ? "t-store__card__bgimg_hover" : "") + ' t-bgimg" data-original="' + imgSrc + '" style="background-image:url(\'' + t_store_getLazyUrl(opts, imgSrc) + "');" + stylesStr + '" ' + imgFieldAttr + "></div>"
        }
        return str += '<div class="' + wrapperClassStr + '" style="' + wrapperStyle + '">',
        str += "    " + t_store_get_productCard_mark_html(product, opts),
        str += "    " + imgEl,
        str += "    " + (opts.imageHover ? hoverImgEl : ""),
        str += "</div>"
    }
    return ""
}
function t_store_get_productCard_img_replaceWith(product, el_product, opts, curImage) {
    var el_image = el_product.find(".t-store__card__imgwrapper")
      , el_newImage = t_store_get_productCard_img_html(product, opts, curImage);
    el_image.replaceWith(el_newImage),
    "y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_onFuncLoad("t_lazyload_update", (function() {
        t_lazyload_update()
    }
    )),
    $("body").trigger("twishlist_addbtn")
}
function t_store_get_productCard_imgElHover_html(product, opts, curtImg) {
    if (product.gallery && "[" === product.gallery[0]) {
        var galleryArr = jQuery.parseJSON(product.gallery);
        if (void 0 !== galleryArr[1]) {
            var imgSrc = galleryArr[1].img;
            if (curtImg && curtImg.length)
                for (var i = 0; i < galleryArr.length; i++) {
                    var img = galleryArr[i].img;
                    if (img !== curtImg) {
                        imgSrc = img;
                        break
                    }
                }
            var stylesStr = t_store_get_productCard_getImgStyles(opts);
            return opts.hasOriginalAspectRatio ? "<img " + t_store_getLazySrc(opts, imgSrc) + ' class="t-store__card__img t-store__card__img_second t-img"/>' : '<div class="t-store__card__bgimg_second t-bgimg" data-original="' + imgSrc + '" style="background-image:url(' + t_store_getLazyUrl(opts, imgSrc) + ");" + stylesStr + '"></div>'
        }
    }
    return ""
}
function t_store_get_productCard_getImgStyles(opts) {
    if (opts.prodCard.borderRadius) {
        var size = parseInt(opts.prodCard.borderRadius, 10);
        return "border-radius:" + size + "px " + size + "px 0px 0px; " + (size > 0 ? "top: -2px;" : "")
    }
    return ""
}
function t_store_get_productCard_mark_html(product, opts) {
    if (!product.mark)
        return "";
    var stylesStr = "";
    stylesStr += opts.markColor ? "color:" + opts.markColor + ";" : "";
    var style, str = "";
    return str += '<div class="t-store__card__mark-wrapper">',
    str += '    <div class="t-store__card__mark" ' + ((stylesStr += opts.markBgColor ? "background-color:" + opts.markBgColor + ";" : "") ? 'style="' + stylesStr + '"' : "") + ">",
    str += "        " + product.mark,
    str += "    </div>",
    str += "</div>"
}
function t_store_get_productCard_txtAndPrice_html(product, edition, opts, strImg) {
    var str = "", removePadStyle;
    return str += '        <div class="t-store__card__textwrapper" ' + ("" === strImg ? 'style="padding-top:0px;"' : "") + ">",
    str += "            " + t_store_get_productCard_txt_html(product, edition, opts),
    Object.prototype.hasOwnProperty.call(opts.price, "position") && "" != opts.price.position || (str += t_store_get_productCard_Price_html(product, edition, opts)),
    str += "        </div>"
}

function t_store_get_productCard_txt_html(product, edition, opts) {
    var str = ""
      , typoClass = "";
    if (Object.prototype.hasOwnProperty.call(opts.price, "position") && "at" == opts.price.position && (str += t_store_get_productCard_Price_html(product, edition, opts)),
    product.title) {
        typoClass = 4 === parseInt(opts.blocksInRow, 10) ? "t-name_xs" : 2 === parseInt(opts.blocksInRow, 10) ? "t-name_xl" : "t-name_md";
        var titleFieldAttr = 1 === product.editions.length ? 'field="st_title__' + edition.uid + '" data-redactor-toolbar="no"' : "";
        str += '<div class="js-store-prod-name js-product-name t-store__card__title t-name ' + typoClass + '" style="' + opts.typo.title + '" ' + titleFieldAttr + ">",
        str += product.title,
        str += "</div>"
    }
    if (Object.prototype.hasOwnProperty.call(opts.price, "position") && "bt" == opts.price.position && (str += t_store_get_productCard_Price_html(product, edition, opts)),
    edition.sku) {
        var skuVisCss, skuColor, skuStyle = 'style="' + (opts.prodCard.showOpts ? "" : "display:none;") + (opts.typo.descrColor ? "color:" + opts.typo.descrColor + ";" : "") + '"', skuFieldAttr = 1 === product.editions.length ? 'field="st_sku__' + edition.uid + '" data-redactor-toolbar="no"' : "";
        str += '<div class="t-store__card__sku t-descr t-descr_xxs" ' + skuStyle + ">",
        str += t_store_dict("sku") + ": ",
        str += '<span class="js-store-prod-sku js-product-sku" ' + skuFieldAttr + ">",
        str += edition.sku,
        str += "</span>",
        str += "</div>"
    }
    if (product.descr) {
        var descrFieldAttr = 1 === product.editions.length ? 'field="st_descr__' + edition.uid + '" data-redactor-toolbar="no"' : "";
        str += '<div class="js-store-prod-descr t-store__card__descr t-descr t-descr_xxs" style="' + opts.typo.descr + '" ' + descrFieldAttr + ">",
        str += "    " + product.descr,
        str += "</div>"
    }
    return str
}


function t_store_get_productCard_txtAndPrice_html1(product, edition, opts, strImg) {
    var str = "",
        removePadStyle;
    return (
        (str += '        <div class="t-store__card__textwrapper" ' + ("" === strImg ? 'style="padding-top:0px;"' : "") + ">"),
        (str += "            " + t_store_get_productCard_txt_html1(product, edition, opts)),
        (str += "        </div>")
    );
}


function t_store_get_productCard_txt_html1(product, edition, opts) {
    var str = ""
      , typoClass = "";
    if (Object.prototype.hasOwnProperty.call(opts.price, "position") && "at" == opts.price.position && (str += t_store_get_productCard_Price_html(product, edition, opts)),
    product.title) {
        typoClass = 4 === parseInt(opts.blocksInRow, 10) ? "t-name_xs" : 2 === parseInt(opts.blocksInRow, 10) ? "t-name_xl" : "t-name_md";
        var titleFieldAttr = 1 === product.editions.length ? 'field="st_title__' + edition.uid + '" data-redactor-toolbar="no"' : "";
        str += '<div class="js-store-prod-name js-product-name t-store__card__title t-name ' + typoClass + '" style="' + opts.typo.title + '" ' + titleFieldAttr + ">",
        str += product.title,
        str += "</div>"
    }
    return str
}



function t_store_get_productCard_Price_html(product, edition, opts) {
    var str = ""
      , modifier = ""
      , formattedPriceRange = t_store__getFormattedPriceRange(opts, product);
    return Object.prototype.hasOwnProperty.call(opts.price, "position") && ("at" == opts.price.position ? modifier = " t-store__card__price-wrapper_above-title" : "bt" == opts.price.position && (modifier = " t-store__card__price-wrapper_below-title")),
    str += '<div class="js-store-price-wrapper t-store__card__price-wrapper' + modifier + '">',
    str += "    " + t_store_get_productCard_onePrice_html(product, edition, opts, "current"),
    formattedPriceRange || (str += "    " + t_store_get_productCard_onePrice_html(product, edition, opts, "old")),
    str += "    " + (0 === parseInt(edition.quantity, 10) ? t_store_get_soldOutMsg_html() : ""),
    str += "</div>"
}
function t_store_get_productCard_onePrice_html(product, edition, opts, type) {
    var value = "current" === type ? edition.price : edition.priceold
      , formattedPrice = t_store__getFormattedPrice(opts, value)
      , formattedPriceRange = t_store__getFormattedPriceRange(opts, product);
    formattedPrice = formattedPriceRange || formattedPrice;
    var priceType = "current" === type ? "price" : "priceold"
      , str = ""
      , priceStylingClass = "current" === type ? "t-store__card__price" : "t-store__card__price_old"
      , styleAttr = ""
      , styleStr = ""
      , color = "current" === type ? opts.price.color : opts.price.colorOld;
    styleStr += value && "0" !== value ? "" : "display: none;",
    styleStr += color ? "color:" + color + ";" : "",
    styleStr += opts.price.fontSize ? "font-size:" + opts.price.fontSize + ";" : "",
    styleAttr = "" !== (styleStr += opts.price.fontWeight ? "font-weight:" + opts.price.fontWeight + ";" : "") ? 'style = "' + styleStr + '"' : "";
    var priceFieldAttr = 1 === product.editions.length ? 'field="st_' + priceType + "__" + edition.uid + '" data-redactor-toolbar="no"' : ""
      , currency = opts.currencyTxt ? '<div class="t-store__card__price-currency">' + opts.currencyTxt + "</div>" : ""
      , jsProdClass = "current" === type ? "js-product-price js-store-prod-price-val" : "js-store-prod-price-old-val";
    return formattedPriceRange && (jsProdClass += " js-store-prod-price-range-val"),
    str += '<div class="' + priceStylingClass + ' t-store__card__price-item t-name t-name_xs" ' + styleAttr + ">",
    formattedPriceRange || (str += "r" !== opts.currencySide && currency ? currency : ""),
    str += '<div class="' + jsProdClass + ' t-store__card__price-value notranslate" translate="no" ' + priceFieldAttr + ">" + formattedPrice + "</div>",
    formattedPriceRange || (str += "r" === opts.currencySide && currency ? currency : ""),
    product.portion > 0 && (str += '<div class="t-store__prod__price-portion">/',
    "1" !== product.portion && (str += +product.portion + " "),
    str += t_store_dict(product.unit) + "</div>"),
    str += "</div>"
}
function t_store_get_productCard_btn_html(product, edition, opts, isRelevantsShow, recid, rec) {
    if (!opts.prodCard.btnTitle1 && !opts.prodCard.btnTitle2)
        return "";
    var str = "", link, linkTarget, btnSizeClass = "sm" === opts.btnSize ? "t-btn_xs" : "t-btn_sm", isSoldOut = "" !== edition.quantity && parseInt(edition.quantity, 10) <= 0, canClickBtn1 = !isSoldOut || isSoldOut && "order" !== opts.prodCard.btnLink1, canClickBtn2 = !isSoldOut || isSoldOut && "order" !== opts.prodCard.btnLink2;
    return str += '<div class="t-store__card__btns-wrapper js-store-buttons-wrapper">',
    opts.prodCard.btnTitle1 && canClickBtn1 && (str += '<a href="' + (link = t_store_get_productCard_link(opts.prodCard.btnLink1, product, isRelevantsShow, recid, rec)) + '" ' + (linkTarget = t_store_get_productCard_targetAttr(opts.prodCard.btnLink1, product)) + ' class="js-store-prod-btn t-store__card__btn t-btn ' + btnSizeClass + '" style="' + opts.btn1_style + '"><span class="t-store__card__btn-text">' + opts.prodCard.btnTitle1 + "</span></a>"),
    opts.prodCard.btnTitle2 && canClickBtn2 && (str += '<a href="' + (link = t_store_get_productCard_link(opts.prodCard.btnLink2, product, isRelevantsShow, recid, rec)) + '" ' + (linkTarget = t_store_get_productCard_targetAttr(opts.prodCard.btnLink2, product)) + ' class="js-store-prod-btn2 t-store__card__btn t-store__card__btn_second t-btn ' + btnSizeClass + '" style="' + opts.btn2_style + '"><span class="t-store__card__btn-text">' + opts.prodCard.btnTitle2 + "</span></a>"),
    str += "</div>"
}
function t_store_get_productCard_link(link, product, isRelevantsShow, recid, rec) {
    var isSnippet, relevantUrl;
    if (rec[0] && ($.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]) && "popup" === link))
        return t_store_generateUrl(product);
    if ("order" === link)
        return "#order";
    if (isRelevantsShow)
        return product.buttonlink ? product.buttonlink : "#prodpopup";
    if ("popup" === link) {
        if (product.buttonlink) {
            var url = product.buttonlink;
            return -1 === url.indexOf("//") && "/" !== url.slice(0, 1) && (url = "http://" + url),
            url
        }
        return "#prodpopup"
    }
    return "#prodpopup"
}
function t_store_get_productCard_targetAttr(link, product) {
    return "popup" === link && product.buttonlink && "_blank" === product.buttontarget ? 'target="_blank"' : ""
}
function t_store_get_horizSeparator_html(opts) {
    var str = '<div class="t-clear t-store__grid-separator" [[style]]></div>';
    return str = str.replace("[[style]]", opts.vindent ? 'style="margin-bottom:' + opts.vindent + ';"' : "")
}
function t_store_unifyCardsHeights(recid, opts) {
    if (opts.prodCard && opts.prodCard.hasWrap) {
        var rec = $("#rec" + recid);
        [".t-store__grid-cont .t-store__card", ".t-popup__container .t-store__card"].forEach((function(el) {
            var cards = rec.find(el)
              , blocksPerRow = t_store_unifyCardsHeights_getBlocksInRow(opts, cards);
            if ($(window).width() <= 480 && !opts.isHorizOnMob)
                rec.find(".t-store__card__wrap_txt-and-btns").css("height", "auto");
            else
                for (var i = 0; i < cards.length; i += blocksPerRow) {
                    var maxH = 0
                      , rowCards = cards.slice(i, i + blocksPerRow).find(".t-store__card__wrap_txt-and-btns");
                    rowCards.each((function() {
                        var txt = $(this).find(".store__card__wrap_txt-and-opts")
                          , btns = $(this).find(".t-store__card__btns-wrapper")
                          , height = txt.outerHeight() + btns.outerHeight();
                        height > maxH && (maxH = height)
                    }
                    )),
                    rowCards.css("height", maxH)
                }
        }
        ))
    }
}
function t_store_unifyCardsHeights_getBlocksInRow(opts, cards) {
    return $(window).width() <= 960 && opts.isHorizOnMob ? cards.length : $(window).width() <= 960 ? 2 : parseInt(opts.blocksInRow, 10)
}
function t_store_get_soldOutMsg_html() {
    return '<div class="js-store-prod-sold-out t-store__card__sold-out-msg t-name t-name_xs">' + t_store_dict("soldOut") + "</div>"
}
function t_store_initPopup(recid, obj_products, options, isRelevantsShow, obj) {
    for (var productKey in isRelevantsShow || window.localStorage.setItem("urlBeforePopupOpen", window.location.href),
    obj_products) {
        var rec = $("#rec" + recid)
          , productNode = isRelevantsShow ? rec.find(".js-product-relevant[data-product-gen-uid=" + productKey + "]") : rec.find("[data-product-gen-uid=" + productKey + "]")
          , popupTrigger = productNode.find('[href^="#prodpopup"]');
        popupTrigger.unbind();
        var el_prodItem = productNode.closest(".js-product")
          , lid_prod = el_prodItem.attr("data-product-gen-uid")
          , productObj = obj_products[lid_prod];
        void 0 !== productObj && popupTrigger.attr("href", productObj.url),
        popupTrigger.click((function(e) {
            if (e.preventDefault(),
            !$(e.target).hasClass("t1002__addBtn") && !$(e.target).parents().hasClass("t1002__addBtn")) {
                el_prodItem = $(this).closest(".js-product"),
                lid_prod = el_prodItem.attr("data-product-gen-uid"),
                productObj = obj_products[lid_prod];
                var ctrlKey = e.ctrlKey
                  , cmdKey = e.metaKey && -1 !== navigator.platform.indexOf("Mac");
                ctrlKey || cmdKey ? window.open(productObj.url) : (obj.header || obj.footer) && obj.disablepopup ? location.href = productObj.url : t_store_openProductPopup(recid, options, productObj, isRelevantsShow, !1, !!isRelevantsShow)
            }
        }
        ))
    }
    options.isPublishedPage && setTimeout((function() {
        t_store_checkUrl(options, recid)
    }
    ), 300),
    t_store_copyTypographyFromLeadToPopup(recid, options)
}
function t_store_openProductPopup(recid, opts, productObj, isRelevantsShow, fromHistory, fromPopup) {
    var isSnippet = $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]);
    isSnippet || t_store_open_popup_routing_init(recid, opts);
    var showRelevants = opts.showRelevants, rec = $("#rec" + recid), el_popup = rec.find(".t-popup"), el_product;
    t_store_drawProdPopup(recid, el_popup, productObj, opts, fromPopup),
    t_store_showPopup(recid, fromHistory, fromPopup);
    try {
        Tilda && "function" == typeof Tilda.sendEcommerceEvent && Tilda.sendEcommerceEvent("detail", [{
            id: "" + (productObj.id ? productObj.id : productObj.uid),
            uid: "" + productObj.uid,
            price: "" + (productObj.price_min ? productObj.price_min : productObj.price),
            sku: productObj.sku ? productObj.sku : "",
            name: productObj.title
        }]);
        var analytics = el_popup.attr("data-track-popup");
        if (analytics > "") {
            var virtTitle = "Popup: " + productObj.title;
            Tilda.sendEventToStatistics(analytics, virtTitle, "", 0)
        }
    } catch (e) {}
    if (opts.isPublishedPage && !fromHistory && t_store_changeUrl(recid, productObj, isRelevantsShow, opts),
    "973" === rec.attr("data-record-type") ? t_slds_updateSlider(recid + " .js-store-product") : t_slds_updateSlider(recid),
    showRelevants && !isSnippet) {
        var relevantsLabel, relevantsMethod = {
            cc: "current_category",
            all: "all_categories"
        }[showRelevants] || "category_" + showRelevants, relevantsSort = "random", relevantsQuantity = opts.relevants_quantity || 4;
        t_store_loadProducts("relevants", recid, opts, !1, {
            currentProductUid: productObj.uid,
            relevantsQuantity: relevantsQuantity,
            relevantsMethod: relevantsMethod,
            relevantsSort: "random"
        })
    }
    ("y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_popup_updLazyOnScroll(recid),
    "both" === opts.showStoreBtnQuantity || "popup" === opts.showStoreBtnQuantity) && t_store_addProductQuantity(recid, $("#rec" + recid + " .t-popup .js-store-product"), productObj, opts);
    t_store_hoverZoom_init(recid),
    setTimeout((function() {
        t_store_onFuncLoad("t_animate__setAnimationStateChains", (function() {
            var animChainsBlocks = $(".r").has(".t-animate[data-animate-chain=yes]");
            t_animate__setAnimationStateChains(animChainsBlocks)
        }
        ))
    }
    ), 300)
}
function t_store_addProductQuantity(recid, el_product, product, options) {
    var popupButton = el_product.find('.t-store__prod-popup__btn-wrapper a[href="#order"]:not(.t-store__prod-popup__btn_disabled)').first(), cardButton = el_product.find('.t-store__card__btns-wrapper a[href="#order"]:not([style*="display: none"])').first(), quantity = parseInt(product.quantity, 10), quantityBtns;
    if (isNaN(quantity) && void 0 !== product.editions) {
        var firstAvailabeEdition = t_store_product_getFirstAvailableEditionData(product.editions);
        quantity = parseInt(firstAvailabeEdition.quantity, 10)
    }
    if (0 === cardButton.length && 0 === popupButton.length || 0 == quantity || 1 == quantity || "" === options.showStoreBtnQuantity || void 0 === options.showStoreBtnQuantity)
        return (quantityBtns = el_product.find(".t-store__prod__quantity")).parent().removeClass("t-store__card__btns-wrapper--quantity"),
        void quantityBtns.remove();
    if ("list" === options.showStoreBtnQuantity && el_product.hasClass("t-store__card") || "popup" === options.showStoreBtnQuantity && el_product.hasClass("t-store__product-snippet") || "popup" === options.showStoreBtnQuantity && el_product.hasClass("t-store__product-popup") || "both" === options.showStoreBtnQuantity) {
        void 0 === options && (options = {});
        var quantityBtns, input = (quantityBtns = el_product.find(".t-store__prod__quantity")).find(".t-store__prod__quantity-input");
        if (quantityBtns.length < 1) {
            var str = ""
              , btnStyle = options.btn1_style
              , quantityBorderRadius = ""
              , classSize = "";
            if (el_product.hasClass("t-store__card") && (classSize = "",
            "sm" === options.btnSize && (classSize = "t-store__prod__quantity_xs")),
            "" !== btnStyle && void 0 !== btnStyle) {
                var position = btnStyle.indexOf("border-radius");
                if (-1 !== position) {
                    var endPosition = btnStyle.slice(position).indexOf(";");
                    quantityBorderRadius = btnStyle.slice(position + 14, position + endPosition)
                }
            }
            var borderRadius = "";
            "" !== quantityBorderRadius && (borderRadius = "border-radius:" + quantityBorderRadius + ";"),
            str += '<div class="t-store__prod__quantity ' + classSize + '" style="' + borderRadius + '">',
            str += '<div class="t-store__prod__quantity__minus-wrapper">',
            str += '<span class="t-store__prod__quantity__minus"></span>',
            str += "</div>",
            str += '<input class="t-store__prod__quantity-input t-descr t-descr_xxs" type="number" min="1" max="9999" step="1" value="1" size="4" maxlength="4" />',
            str += '<div class="t-store__prod__quantity__plus-wrapper">',
            str += '<span class="t-store__prod__quantity__plus"></span>',
            str += "</div>",
            str += "</div>",
            1 === popupButton.length ? popupButton.before(str) : 1 === cardButton.length && cardButton.before(str),
            t_store_addProductQuantityEvents(el_product),
            input = (quantityBtns = el_product.find(".t-store__prod__quantity")).find(".t-store__prod__quantity-input");
            var btnsWrapper = cardButton.parent();
            btnsWrapper.addClass("t-store__card__btns-wrapper--quantity"),
            btnsWrapper.find('a:not([href^="#order"])').length > 0 && btnsWrapper.parent().is("div[class]") && btnsWrapper.wrap("<div></div>")
        } else {
            var min = input.prop("min") || 1;
            input.val(min),
            input.change();
            var value = input.val();
            isNaN(quantity) ? quantityBtns.removeClass("t-store__prod-popup__btn_disabled") : quantity > 1 ? (quantityBtns.removeClass("t-store__prod-popup__btn_disabled"),
            0 === parseInt(value, 10) && input.val(min)) : quantityBtns.addClass("t-store__prod-popup__btn_disabled")
        }
        isNaN(quantity) ? input.prop("max", 9999) : quantity > 0 && input.prop("max", quantity)
    }
}
function t_store_addProductQuantityEvents(product) {
    var quantityBtns, input = product.find(".t-store__prod__quantity").find(".t-store__prod__quantity-input");
    product.find(".t-store__prod__quantity__minus-wrapper").off("click"),
    product.find(".t-store__prod__quantity__minus-wrapper").on("click", (function() {
        1 === input.length && input[0].stepDown()
    }
    )),
    product.find(".t-store__prod__quantity__plus-wrapper").off("click"),
    product.find(".t-store__prod__quantity__plus-wrapper").on("click", (function() {
        1 === input.length && input[0].stepUp()
    }
    )),
    product.find(".t-store__prod__quantity-input").off("change"),
    product.find(".t-store__prod__quantity-input").on("change", (function() {
        var min = input.prop("min") || 1
          , max = input.prop("max") || 9999
          , value = parseInt(input.val() || 1, 10);
        value < 1 || isNaN(value) ? input.val(min) : value > max ? input.val(max) : input.val(value)
    }
    ))
}
function t_store_open_popup_routing_init(recid, opts) {
    window.onpopstate = function() {
        if (window.history.state)
            if (window.history.state.productData) {
                var productPopupData = window.history.state.productData, recidFromHistory, optsFromHistory, productObjFromHistory, isRelevantsShowFromHistory;
                t_store_openProductPopup(productPopupData.recid, productPopupData.opts, productPopupData.productObj, productPopupData.isRelevantsShow, !0)
            } else
                t_store_closePopup(!0, recid, opts);
        else
            t_store_closePopup(!0, recid, opts)
    }
}
function t_store_popup_updLazyOnScroll(recid) {
    var scrollContainer = $("#rec" + recid + " .t-popup")
      , curMode = $(".t-records").attr("data-tilda-mode");
    scrollContainer.length && "edit" != curMode && "preview" != curMode && scrollContainer.bind("scroll", t_throttle((function() {
        "y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_onFuncLoad("t_lazyload_update", (function() {
            t_lazyload_update()
        }
        ))
    }
    ), 1e3))
}
function t_store_changeUrl(recid, product, isRelevantsShow, opts) {
    var curUrl = window.location.href, productData = {
        productObj: product,
        opts: opts,
        isRelevantsShow: isRelevantsShow,
        recid: recid
    }, newUrl, newPageTitle = document.title + " – " + product.title;
    curUrl.indexOf("/tproduct/") < 0 && curUrl.indexOf("%2Ftproduct%2F") < 0 ? t_store_history_pushState({
        productData: productData
    }, newPageTitle, newUrl = t_store_generateUrl(product)) : isRelevantsShow && t_store_history_pushState({
        productData: productData
    }, newPageTitle, newUrl = t_store_generateUrl(product))
}
function t_store_generateUrl(product) {
    var currentProtocol = window.location.protocol, currentHost = window.location.host, relativeProductPath, newUrl;
    return (relativeProductPath = (relativeProductPath = product.url.split("://")[1]).split("/")).shift(),
    currentProtocol + "//" + currentHost + "/" + (relativeProductPath = relativeProductPath.join("/"))
}
function t_store_drawProdPopup(recid, el_popup, product, options, fromPopup) {
    $(el_popup).scrollTop(0);
    var el_product = el_popup.find(".js-store-product.js-product");
    el_product.data("cardSize", "large"),
    t_store_drawProdPopup_drawGallery(recid, el_popup, product, options),
    el_popup.find(".js-store-product").data("def-pack-obj", ""),
    el_popup.find(".js-store-product").attr("data-product-lid", product.uid).attr("data-product-uid", product.uid).attr("data-product-gen-uid", product.uid),
    product.title ? el_popup.find(".js-store-prod-name").html(product.title).show() : el_popup.find(".js-store-prod-name").html("").hide();
    var partuids = [];
    try {
        partuids = JSON.parse(product.partuids)
    } catch (e) {}
    if (void 0 !== options.linksSizeChart && partuids.length > 0) {
        for (var str = "", linksAdded = [], i = 0; i < partuids.length; i++) {
            var uid = partuids[i];
            void 0 !== options.linksSizeChart[uid] && void 0 !== options.linksSizeChart[uid].infotext && void 0 !== options.linksSizeChart[uid].infourl && -1 === linksAdded.indexOf(options.linksSizeChart[uid].infourl) && (str += '    <div class="t-store__prod-popup__link t-descr t-descr_xxs">',
            str += '        <a href="' + options.linksSizeChart[uid].infourl.replace(/"/g, "&quot;") + '" target="_blank">',
            str += "            " + options.linksSizeChart[uid].infotext,
            str += "        </a>",
            str += "    </div>",
            linksAdded.push(options.linksSizeChart[uid].infourl))
        }
        el_popup.find(".t-store__prod-popup__links-wrapper").html(str)
    } else
        el_popup.find(".t-store__prod-popup__links-wrapper").html("");
    t_store_initTextAndCharacteristics(el_popup, product),
    options.tabs && "" !== options.tabs && t_store_tabs_init(recid, options, product, el_product, el_popup),
    t_store_addProductOptions(recid, product, el_product, options),
    t_store_option_handleOnChange_custom(recid, el_product, options),
    t_prod__initProduct(recid, el_product),
    fromPopup && $(window).unbind("resize", window.t_store_prodPopup_updateGalleryThumbsEvent),
    window.t_store_prodPopup_updateGalleryThumbsEvent = function() {
        t_store_prodPopup_updateGalleryThumbs(recid, el_popup, product, options)
    }
    ,
    $(window).bind("resize", window.t_store_prodPopup_updateGalleryThumbsEvent)
}
function t_store_initTextAndCharacteristics(el_popup, product) {
    var isSnippet = $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0])
      , el_prodTxt = el_popup.find(".js-store-prod-text");
    el_prodTxt.empty().hide();
    var pack_label = product.pack_label || ""
      , pack_m = parseInt(product.pack_m, 10) || 0
      , pack_x = parseInt(product.pack_x, 10) || 0
      , pack_y = parseInt(product.pack_y, 10) || 0
      , pack_z = parseInt(product.pack_z, 10) || 0
      , productUrl = product.url || ""
      , isDimentions = pack_label && pack_x && pack_y && pack_z
      , isWeight = pack_m
      , isCharcs = product.characteristics && product.characteristics.length > 0 || isDimentions || isWeight
      , isDescriptionDrawn = !0
      , isCharsDrawn = isCharcs
      , el_tabDescr = el_popup.find('.t-store__tabs__item[data-tab-type="text"]')
      , el_tabCharcs = el_popup.find('.t-store__tabs__item[data-tab-type="chars"]');
    el_tabDescr.length && (isDescriptionDrawn = !1),
    el_tabCharcs.length && (isCharsDrawn = !1);
    var prodTxt = '<div class="js-store-prod-all-text"' + (isDescriptionDrawn ? "" : ' style="display: none;"') + ">";
    prodTxt += product.text ? product.text : product.descr ? product.descr : "",
    prodTxt += "</div>";
    var charcsStyle = isDescriptionDrawn ? "margin-top: 20px;" : ""
      , charcsTxt = '<div class="js-store-prod-all-charcs"' + ((charcsStyle += isCharsDrawn ? "" : "display: none;").length ? ' style="' + charcsStyle + '"' : "") + ">";
    if (isCharcs && product.characteristics.forEach((function(ch) {
        charcsTxt += '<p class="js-store-prod-charcs">' + ch.title + ": " + ch.value + "</p>"
    }
    )),
    charcsTxt += '<p class="js-store-prod-dimensions"></p>',
    charcsTxt += '<p class="js-store-prod-weight"></p>',
    charcsTxt += "</div>",
    el_prodTxt.append(prodTxt),
    el_prodTxt.append(charcsTxt),
    el_prodTxt.show(),
    isSnippet && el_tabCharcs.length) {
        var el_charcsContent = el_tabCharcs.find(".t-store__tabs__content");
        el_charcsContent.empty(),
        el_charcsContent.append(charcsTxt),
        el_charcsContent.find(".js-store-prod-all-charcs").show(),
        el_charcsContent.find(".js-store-prod-all-charcs").css("margin-top", "0")
    }
    if (isDimentions) {
        var dimension = pack_x + "x" + pack_y + "x" + pack_z;
        el_popup.find(".js-store-prod-dimensions").html(t_store_dict("product-" + pack_label) + ": " + dimension + "&nbsp;" + t_store_dict("mm")),
        isSnippet && (el_tabCharcs.find(".js-store-prod-dimensions").html(t_store_dict("product-" + pack_label) + ": " + dimension + "&nbsp;" + t_store_dict("mm")),
        el_popup.attr("data-product-pack-label", pack_label),
        el_popup.attr("data-product-pack-x", pack_x),
        el_popup.attr("data-product-pack-y", pack_y),
        el_popup.attr("data-product-pack-z", pack_z))
    }
    isWeight && (el_popup.find(".js-store-prod-weight").html(t_store_dict("product-weight") + ": " + pack_m + "&nbsp;" + t_store_dict("g")),
    isSnippet && (el_tabCharcs.find(".js-store-prod-weight").html(t_store_dict("product-weight") + ": " + pack_m + "&nbsp;" + t_store_dict("g")),
    el_popup.attr("data-product-pack-m", pack_m))),
    el_popup.find(".js-store-product").attr("data-product-pack-label", pack_label).attr("data-product-pack-m", pack_m).attr("data-product-pack-x", pack_x).attr("data-product-pack-y", pack_y).attr("data-product-pack-z", pack_z),
    el_popup.find(".js-store-product").attr("data-product-url", productUrl)
}
function t_store_addProductOptions(recid, product, el_product, options) {
    var optionsWrapper = el_product.find(".js-product-controls-wrapper");
    optionsWrapper.html("");
    var isSnippet = $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0])
      , firstAvailabeEdition = t_store_product_getFirstAvailableEditionData(product.editions);
    t_store_product_initEditions(recid, product, el_product, options);
    var param1 = {
        name: product.prod_option,
        values: product.prod_variants
    }
      , param2 = {
        name: product.prod_option2,
        values: product.prod_variants2
    }
      , param3 = {
        name: product.prod_option3,
        values: product.prod_variants3
    }
      , param4 = {
        name: product.prod_option4,
        values: product.prod_variants4
    }
      , param5 = {
        name: product.prod_option5,
        values: product.prod_variants5
    };
    t_store_product_addOneOptionsControl("modificator", param1, optionsWrapper, options, firstAvailabeEdition, recid),
    t_store_product_addOneOptionsControl("modificator", param2, optionsWrapper, options, firstAvailabeEdition, recid),
    t_store_product_addOneOptionsControl("modificator", param3, optionsWrapper, options, firstAvailabeEdition, recid),
    t_store_product_addOneOptionsControl("modificator", param4, optionsWrapper, options, firstAvailabeEdition, recid),
    t_store_product_addOneOptionsControl("modificator", param5, optionsWrapper, options, firstAvailabeEdition, recid),
    isSnippet && t_store_option_handleOnChange_custom(recid, el_product, options)
}
function t_store_get_control_option_html(options) {
    var str = ""
      , styleAttr = ""
      , styleStr = ""
      , color = options.typo && options.typo.descrColor ? options.typo.descrColor : "";
    return str += '<div class="js-product-option t-product__option">',
    str += '    <div class="js-product-option-name t-product__option-title t-descr t-descr_xxs" ' + (styleAttr = "" !== (styleStr += "" !== color ? "color:" + color + ";" : "") ? 'style = "' + styleStr + '"' : "") + ">[[name]]</div>",
    str += '    <div class="t-product__option-variants t-product__option-variants_regular"> <select class="js-product-option-variants t-product__option-select t-descr t-descr_xxs"> [[optiontags]] </select> </div>',
    str += "</div>"
}
function t_store_get_control_editionOption_html(options, curOption) {
    var str = "", styleAttr, styleStr = "", dataAttr = "", color = options.typo && options.typo.descrColor ? options.typo.descrColor : "";
    styleAttr = "" !== (styleStr += "" !== color ? "color:" + color + ";" : "") ? 'style = "' + styleStr + '"' : "";
    var isCustomOption, optionStyle = t_store_option_checkIfCustom(curOption) ? ' style="display: none;"' : "";
    return curOption.params && (curOption.params.view && (dataAttr += ' data-view-type="' + curOption.params.view + '"'),
    curOption.params.hasColor ? dataAttr += ' data-option-type="color"' : dataAttr += ' data-option-type="regular"'),
    str += '<div class="js-product-edition-option t-product__option" data-edition-option-id="[[id]]"' + dataAttr + ">",
    str += '    <div class="js-product-edition-option-name t-product__option-title t-descr t-descr_xxs" ' + styleAttr + ">[[name]]</div>",
    str += '    <div class="t-product__option-variants t-product__option-variants_regular"' + optionStyle + '> <select class="js-product-edition-option-variants t-product__option-select t-descr t-descr_xxs"> [[optiontags]] </select> </div>',
    str += "</div>"
}
function t_store_option_styleCustomControl(recid, options, curOption, optionsWrapper, firstAvailabeEdition) {
    var str = ""
      , wrapper = optionsWrapper.find('.js-product-edition-option[data-edition-option-id="' + curOption.id + '"]')
      , isSelect = curOption.params && "select" === curOption.params.view
      , isColor = curOption.params && curOption.params.hasColor && !curOption.params.linkImage
      , isImage = curOption.params && curOption.params.linkImage
      , defaultValue = curOption.values[0]
      , parentMod = t_store_option_getClassModificator(curOption, "select", "t-product__option-variants")
      , labelMod = t_store_option_getClassModificator(curOption, "select", "t-product__option-item")
      , inputMod = t_store_option_getClassModificator(curOption, "select", "t-product__option-input")
      , checkmarkMod = t_store_option_getClassModificator(curOption, "select", "t-product__option-checkmark")
      , titleMod = t_store_option_getClassModificator(curOption, "select", "t-product__option-title");
    if (isSelect) {
        var selectedMod, colorStyle;
        if (str += '<div class="t-product__option-selected ' + t_store_option_getClassModificator(curOption, "select", "t-product__option-selected") + ' t-descr t-descr_xxs">',
        isColor)
            str += '    <span class="t-product__option-selected-checkmark"' + (' style="background-color: ' + t_store_option_getColorValue(curOption.valuesObj, defaultValue) + ';"') + "></span>";
        else if (isImage) {
            var value = curOption.values[0], url, lazyUrl, imageStyle;
            str += '    <div class="t-product__option-selected-checkmark t-bgimg" data-original="' + (url = curOption.imagesObj[value]) + '"' + ((lazyUrl = t_store_getLazyUrl(options, url)) ? " style=\"background-image: url('" + lazyUrl + "');\"" : "") + "></div>"
        }
        str += '        <span class="t-product__option-selected-title">' + defaultValue + "</span>",
        str += "</div>",
        parentMod += " t-product__option-variants_hidden"
    }
    str += '<form class="t-product__option-variants t-product__option-variants_custom ' + parentMod + '">';
    for (var i = 0; i < curOption.values.length; i++) {
        var value = curOption.values[i], isActive = firstAvailabeEdition[curOption.name] === value, checked = isActive ? " checked" : "", activeClass = isActive ? " t-product__option-item_active " : "", checkmarkStyle = isColor ? ' style="background-color: ' + t_store_option_getColorValue(curOption.valuesObj, value) + ';"' : "", url, lazyUrl;
        if (str += '<label class="t-product__option-item ' + activeClass + labelMod + '">',
        str += '    <input class="t-product__option-input ' + inputMod + '" type="radio" name="' + curOption.name + '" value="' + t_store_escapeQuote(value) + '"' + checked + ">",
        isImage && curOption.imagesObj)
            str += '    <div class="t-product__option-checkmark t-bgimg ' + checkmarkMod + '"' + (checkmarkStyle = (lazyUrl = t_store_getLazyUrl(options, url = curOption.imagesObj[value])) ? " style=\"background-image: url('" + lazyUrl + "');\"" : "") + ' data-original="' + url + '"></div>';
        else
            str += '    <div class="t-product__option-checkmark ' + checkmarkMod + '"' + checkmarkStyle + "></div>";
        str += '    <span class="t-product__option-title ' + titleMod + ' t-descr t-descr_xxs">' + value + "</span>",
        str += "</label>"
    }
    str += "</form>",
    wrapper.append(str)
}
function t_store_option_getColorValue(valuesObj, value) {
    var result = "#ffffff";
    for (var key in valuesObj) {
        var item = valuesObj[key];
        if (item.value === value) {
            result = item.color;
            break
        }
    }
    return result
}
function t_store_option_getClassModificator(curOption, type, className) {
    if (!curOption)
        return "";
    var params = curOption.params
      , result = className + "_" + params.view;
    return params.hasColor && params.linkImage ? "filter" === type ? (result = className + "_buttons",
    result += " " + className + "_color") : result += " " + className + "_image" : params.hasColor ? result += " " + className + "_color" : params.linkImage ? result += " " + className + "_image" : result += " " + className + "_simple",
    result
}
function t_store_checkUrl(opts, recid) {
    var curUrl = window.location.href
      , tprodIndex = curUrl.indexOf("/tproduct/");
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && tprodIndex < 0 && (tprodIndex = curUrl.indexOf("/tproduct/")) < 0 && (tprodIndex = curUrl.indexOf("%2Ftproduct%2F")),
    tprodIndex >= 0) {
        var prodDataArr = (curUrl = curUrl.substring(tprodIndex, curUrl.length)).split("-");
        if (void 0 === prodDataArr[1])
            return;
        var curProdUid = prodDataArr[1]
          , rec = $("#rec" + recid)
          , prod = rec.find(".js-store-grid-cont [data-product-gen-uid=" + curProdUid + "]")
          , el_popup = rec.find(".t-popup");
        if (curUrl.indexOf(recid) >= 0 && prod.length)
            el_popup.hasClass("t-popup_show") || rec.find("[data-product-gen-uid=" + curProdUid + '] [href^="#prodpopup"]').triggerHandler("click");
        else if (curUrl.indexOf(recid) >= 0) {
            if (el_popup.hasClass("t-popup_show"))
                return;
            var isSnippet;
            $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]) || t_store_loadOneProduct(recid, opts, curProdUid).then((function(data) {
                if ("string" == typeof data && "{" == data.substr(0, 1)) {
                    try {
                        var dataObj, productObj = jQuery.parseJSON(data).product
                    } catch (e) {
                        console.log(data)
                    }
                    if ("" === productObj)
                        return void console.log("Can't get product with uid = " + curProdUid + " in storepart = " + opts.storepart);
                    t_store_openProductPopup(recid, opts, productObj)
                } else
                    console.log("Can't get product with uid = " + curProdUid + " in storepart = " + opts.storepart)
            }
            ))
        }
    }
}
function t_store_showPopup(recid, fromHistory, fromPopup) {
    var el = $("#rec" + recid)
      , popup = el.find(".t-popup");
    t_store_resetNavStyles(recid),
    $("body").addClass("t-body_popupshowed").trigger("popupShowed"),
    popup.css("display", "block");
    var isPopupOverflowed = document.querySelector("#rec" + recid + " .t-popup").scrollHeight > document.documentElement.clientHeight;
    isPopupOverflowed || popup.css("overflow", "hidden"),
    setTimeout((function() {
        popup.find(".t-popup__container").addClass("t-popup__container-animated"),
        popup.addClass("t-popup_show"),
        $("body").trigger("twishlist_addbtn"),
        "y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_onFuncLoad("t_lazyload_update", (function() {
            t_lazyload_update()
        }
        )),
        isPopupOverflowed || setTimeout((function() {
            popup.css("overflow", "auto")
        }
        ), 300)
    }
    ), 50),
    fromPopup || addPopupEvents(el, recid)
}
function addPopupEvents(el) {
    el.find(".t-popup").off("click"),
    el.find(".t-popup").on("click", (function(e) {
        e.target == this && t_store_closePopup(!1)
    }
    )),
    el.find(".t-popup__close, .js-store-close-text").off("click"),
    el.find(".t-popup__close, .js-store-close-text").on("click", (function() {
        t_store_closePopup(!1)
    }
    )),
    $(document).keydown((function(e) {
        27 == e.keyCode && t_store_closePopup(!1)
    }
    )),
    el.find(".t-popup").off("scroll"),
    t_store_addEvent_scrollNav(el.find(".t-popup"))
}
function t_store_addEvent_scrollNav(el) {
    el.off("scroll");
    var fadeStart = 30
      , fadeUntil = 200
      , fading = el.find(".t-popup__close-opacity-scroll");
    fading.length && el.on("scroll", (function() {
        var offset = el.scrollTop()
          , opacity = 0;
        opacity = offset >= 200 ? 1 : offset <= 30 ? 0 : offset / 200,
        fading.css("background-color", "rgba(255,255,255," + opacity + ")")
    }
    ))
}
function t_store_resetNavStyles(recid) {
    var nav = $("#rec" + recid).find(".t-popup__close");
    nav.hasClass("t-popup__close-solid") ? nav.css("background-color", "rgba(255,255,255,1)") : nav.hasClass("t-popup__close-opacity-scroll") && nav.css("background-color", "rgba(255,255,255,0)")
}
function t_store_closePopup(fromHistory, recid, opts) {
    var isSnippet, storepartuid, optsFromHistory, productData, urlBeforePopupOpen;
    if ($.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]) || t_store_closePopup_routing(),
    $(".t-popup").removeClass("t-popup_show"),
    setTimeout((function() {
        $("body").removeClass("t-body_popupshowed").trigger("popupHidden")
    }
    ), 300),
    fromHistory)
        if (t_store_isQueryInAddressBar("tstore")) {
            var hashArr = decodeURI(window.location.hash).split("/"), storepartValueIndex = hashArr.indexOf("c") + 1, storeuidIndex = hashArr.indexOf("r") + 1, storepartuid, storeuid = hashArr[storeuidIndex];
            storepartuid = -1 != hashArr[storepartValueIndex].indexOf("-") ? hashArr[storepartValueIndex].slice(0, hashArr[storepartValueIndex].indexOf("-")) : hashArr[storepartValueIndex],
            (optsFromHistory = window.history.state.opts).storepart = storepartuid,
            t_store_isStorepartFromHistoryActive(storepartuid, recid, opts) || t_store_loadProducts("", storeuid, optsFromHistory)
        } else
            t_store_isStorepartFromHistoryActive(opts.storepart, recid, opts) || t_store_loadProducts("", recid, opts);
    else
        window.history.state && window.history.state.productData && (urlBeforePopupOpen = window.localStorage.getItem("urlBeforePopupOpen"),
        t_store_history_pushState({
            storepartuid: storepartuid = (productData = window.history.state.productData).opts.storepart,
            opts: opts = productData.opts,
            recid: recid = productData.recid
        }, null, urlBeforePopupOpen));
    t_store_setActiveStorePart(recid, opts),
    t_store_galleryVideoClearFrame(recid),
    setTimeout((function() {
        $(".t-popup").scrollTop(0),
        $(".t-popup").not(".t-popup_show").css("display", "none")
    }
    ), 300),
    $(document).unbind("keydown"),
    $(window).unbind("resize", window.t_store_prodPopup_updateGalleryThumbsEvent),
    $("body").trigger("twishlist_addbtn")
}
function t_store_isStorepartFromHistoryActive(storepartuid, recid, opts) {
    var rec = $("#rec" + recid), activeStorepartUid;
    return !(!opts || opts.storePartsArr) || !!storepartuid && (storepartuid = parseInt(storepartuid, 10),
    rec.find(".js-store-parts-switcher.t-active").data("storepartUid") === storepartuid)
}
function t_store_closePopup_routing() {
    window.onpopstate = function() {
        if (window.history.state) {
            if (window.history.state.productData) {
                var productPopupData = window.history.state.productData, recid = productPopupData.recid, opts = productPopupData.opts, productObj, isRelevantsShow;
                t_store_openProductPopup(recid, opts, productPopupData.productObj, productPopupData.isRelevantsShow, !0)
            }
            if (window.history.state.storepartuid) {
                var optsFromHistory = window.history.state.opts
                  , recidFromHistory = window.history.state.recid;
                opts.isPublishedPage = !0,
                t_store_loadProducts("", recidFromHistory, optsFromHistory)
            }
        }
    }
}
function t_store_copyTypographyFromLeadToPopup(recid, options) {
    var rec = $("#rec" + recid)
      , titleStyle = rec.find(".js-store-grid-cont .js-store-prod-name").attr("style")
      , descrStyle = rec.find(".js-store-grid-cont .js-store-prod-descr").attr("style");
    void 0 === descrStyle && "" != options.typo.descr && (descrStyle = options.typo.descr),
    rec.find(".t-popup .js-store-prod-name").attr("style", t_store_removeSizesFromStylesLine(titleStyle)),
    rec.find(".t-popup .js-store-prod-text").attr("style", t_store_removeSizesFromStylesLine(descrStyle))
}
function t_store_removeSizesFromStylesLine(styleStr) {
    if (void 0 !== styleStr && (styleStr.indexOf("font-size") >= 0 || styleStr.indexOf("padding-top") >= 0 || styleStr.indexOf("padding-bottom") >= 0)) {
        var styleStrSplitted = styleStr.split(";");
        styleStr = "";
        for (var i = 0; i < styleStrSplitted.length; i++)
            styleStrSplitted[i].indexOf("font-size") >= 0 || styleStrSplitted[i].indexOf("padding-top") >= 0 || styleStrSplitted[i].indexOf("padding-bottom") >= 0 ? (styleStrSplitted.splice(i, 1),
            i--) : "" != styleStrSplitted[i] && (styleStr += styleStrSplitted[i] + ";")
    }
    return styleStr
}
function t_store_drawProdPopup_drawTabs(recid, opts, tabsData) {
    var el_rec, el_wrapper = $("#rec" + recid).find(".t-popup .js-product"), str = "", tabDesign = opts.tabs, isAccordion = "accordion" === tabDesign, activeTab = !isAccordion && tabsData[0] ? tabsData[0] : null, colors = t_store_getCustomColors(opts), descrColorStyle = colors.descrColor ? ' style="color: ' + colors.descrColor + ';"' : "", titleColorStyle = colors.titleColor ? ' style="color: ' + colors.titleColor + ';"' : "";
    str += '<div class="t-store__tabs t-store__tabs_' + tabDesign + ' t-col t-col_12" data-tab-design="' + tabDesign + '"' + (activeTab ? ' data-active-tab="' + activeTab.title + '"' : "") + ">",
    str += '<div class="t-store__tabs__controls-wrap">',
    str += '    <div class="t-store__tabs__controls">',
    isAccordion || (str += t_store_tabs_fade_getStyle(opts),
    str += t_store_tabs_tabBorder_getStyle(recid, opts)),
    tabsData.forEach((function(tab, i) {
        str += '<div class="t-store__tabs__button js-store-tab-button' + (0 !== i || isAccordion ? " " : " t-store__tabs__button_active") + '" data-tab-title="' + t_store_escapeQuote(tab.title) + '">',
        str += '    <div class="t-store__tabs__button-title t-name t-name_xs"' + titleColorStyle + ">",
        str += tab.title,
        str += "    </div>",
        str += "</div>"
    }
    )),
    str += "    </div>",
    str += "</div>",
    str += '    <div class="t-store__tabs__list">',
    isAccordion && (str += t_store_tabs_accordionBorder_getStyle(recid, opts)),
    tabsData.forEach((function(tab, i) {
        var content = t_store_drawProdPopup_getSingleTabData(tab, el_wrapper, opts);
        str += '        <div class="t-store__tabs__item' + (0 !== i || isAccordion ? " " : " t-store__tabs__item_active") + '" data-tab-title="' + t_store_escapeQuote(tab.title) + '" data-tab-type="' + tab.type + '">',
        str += '            <div class="t-store__tabs__item-button js-store-tab-button" data-tab-title="' + t_store_escapeQuote(tab.title) + '">',
        str += '                <div class="t-store__tabs__item-title t-name t-name_xs"' + titleColorStyle + ">",
        str += tab.title,
        str += "                </div>",
        isAccordion && (str += t_store_tabs_closeIcon_getHtml(recid, opts)),
        str += "            </div>",
        str += '            <div class="t-store__tabs__content t-descr t-descr_xxs"' + descrColorStyle + ">",
        str += content,
        str += "            </div>",
        str += "        </div>"
    }
    )),
    str += "    </div>",
    str += "</div>";
    var el_tabs = el_wrapper.find(".t-store__tabs");
    el_tabs.length ? el_tabs.replaceWith(str) : el_wrapper.append(str)
}
function t_store_getCustomColors(opts) {
    var descrColor = opts.typo && opts.typo.descrColor ? opts.typo.descrColor : null, titleColor = opts.typo && opts.typo.titleColor ? opts.typo.titleColor : null, bgColor = opts.popup_opts.containerBgColor && opts.popup_opts.containerBgColor.length ? opts.popup_opts.containerBgColor : "#ffffff", bgColorRgb = t_store_hexToRgb(bgColor), fadeColorTo = "rgba(" + bgColorRgb.join(",") + ",1)", fadeColorFrom = "rgba(" + bgColorRgb.join(",") + ",0)", titleColorRgb, borderActiveColor, borderPassiveColor;
    return titleColor && (borderActiveColor = "rgba(" + (titleColorRgb = t_store_hexToRgb(titleColor)).join(",") + ",1)",
    borderPassiveColor = "rgba(" + titleColorRgb.join(",") + ",0.3)"),
    {
        descrColor: descrColor,
        titleColor: titleColor,
        titleColorRgb: titleColorRgb,
        borderActiveColor: borderActiveColor,
        borderPassiveColor: borderPassiveColor,
        bgColor: bgColor,
        bgColorRgb: bgColorRgb,
        fadeColorTo: fadeColorTo,
        fadeColorFrom: fadeColorFrom
    }
}
function t_store_tabs_fade_getStyle(opts) {
    var str = "", colors = t_store_getCustomColors(opts), fadeStyleLeft, fadeStyleRight;
    return str += "<style>",
    str += "    .t-store__tabs__controls-wrap:before, .t-store__tabs__controls-wrap:after {\n",
    str += "        display: none;\n",
    str += "        z-index: 1;\n",
    str += "        position: absolute;\n",
    str += '        content: "";\n',
    str += "        width: 50px;\n",
    str += "        bottom: 1px;\n",
    str += "        top: 0;\n",
    str += "        pointer-events: none;\n",
    str += "    }\n",
    str += "    .t-store__tabs__controls-wrap_left:before {\n",
    str += "background-image:linear-gradient(to right," + colors.fadeColorTo + " 0%, " + colors.fadeColorFrom + " 90%)" + ";\n",
    str += "        left: -1px;\n",
    str += "    }\n",
    str += "    .t-store__tabs__controls-wrap_right:after {\n",
    str += "background-image:linear-gradient(to right," + colors.fadeColorFrom + " 0%, " + colors.fadeColorTo + " 90%)" + ";\n",
    str += "        right: -2px;\n",
    str += "    }\n",
    str += "    .t-store__tabs__controls-wrap_left:before {\n",
    str += "        display: block;\n",
    str += "    }\n",
    str += "    .t-store__tabs__controls-wrap_right:after {\n",
    str += "        display: block;\n",
    str += "    }\n",
    str += "</style>"
}
function t_store_tabs_tabBorder_getStyle(recid, opts) {
    var str = ""
      , colors = t_store_getCustomColors(opts);
    return colors.borderActiveColor && colors.borderPassiveColor && (str += "<style>",
    str += "@media screen and (max-width:560px) {\n",
    str += "    #rec" + recid + " .t-store .t-store__tabs__controls .t-store__tabs__button.t-store__tabs__button_active {\n",
    str += "        border-bottom: 1px solid " + colors.borderPassiveColor + ";\n",
    str += "    }\n",
    str += "    #rec" + recid + " .t-store .t-store__tabs__controls .t-store__tabs__button_active .t-store__tabs__button-title:after {\n",
    str += "        border-bottom: 1px solid " + colors.borderActiveColor + ";\n",
    str += "    }\n",
    str += "}\n",
    str += "    #rec" + recid + " .t-store .t-store__tabs .t-store__tabs__button {\n",
    str += "        border-bottom: 1px solid " + colors.borderPassiveColor + ";\n",
    str += "    }\n",
    str += "    #rec" + recid + " .t-store .t-store__tabs__controls .t-store__tabs__button_active, \n",
    str += "    #rec" + recid + " .t-store .t-store__tabs__controls .t-store__tabs__button:hover, \n",
    str += "    #rec" + recid + " .t-store .t-store__tabs_snippet .t-store__tabs__controls .t-store__tabs__button:first-child {\n",
    str += "        border-bottom: 1px solid " + colors.borderActiveColor + ";\n",
    str += "    }\n",
    str += "</style>"),
    str
}
function t_store_tabs_accordionBorder_getStyle(recid, opts) {
    var str = ""
      , colors = t_store_getCustomColors(opts);
    return colors.borderActiveColor && colors.borderPassiveColor && (str += "<style>",
    str += "    #rec" + recid + " .t-store .t-store__tabs.t-store__tabs_accordion .t-store__tabs__item-button {\n",
    str += "        border-top: 1px solid " + colors.borderActiveColor + ";\n",
    str += "    }\n",
    str += "    #rec" + recid + " .t-store .t-store__tabs_accordion .t-store__tabs__item-button:not(.t-store__tabs__item-button_active) {\n",
    str += "        border-bottom: 1px solid " + colors.borderActiveColor + ";\n",
    str += "    }\n",
    str += "</style>"),
    str
}
function t_store_tabs_closeIcon_getHtml(recid, opts) {
    var str = ""
      , colors = t_store_getCustomColors(opts)
      , fillColor = colors.borderActiveColor ? colors.borderActiveColor : "#222222";
    return str += '<div class="t-store__tabs__close">',
    colors.borderPassiveColor && (str += "<style>",
    str += "    #rec" + recid + " .t-store .t-store__tabs__close:after {\n",
    str += "        background-color: " + colors.borderPassiveColor + ";\n",
    str += "    }\n",
    str += "</style>"),
    str += '    <svg class="t-store__tabs__close-icon" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
    str += '        <g stroke="none" stroke-width="1px" fill="none" fill-rule="evenodd" stroke-linecap="square">',
    str += '        <g transform="translate(1.000000, 1.000000)" stroke="' + fillColor + '">',
    str += '            <path d="M0,11 L22,11"></path>',
    str += '            <path d="M11,0 L11,22"></path>',
    str += "        </g>",
    str += "        </g>",
    str += "    </svg>",
    str += "</div>"
}
function t_store_drawProdPopup_getSingleTabData(tab, el_wrapper, opts) {
    return tab && "object" == typeof tab ? "info" === tab.type || "template" === tab.type ? t_store_addLazyLoadToHtml(opts, tab.data) : "text" === tab.type ? el_wrapper.find(".js-store-prod-all-text").html() : "chars" === tab.type ? el_wrapper.find(".js-store-prod-all-charcs").html() : void 0 : null
}
function t_store_addLazyLoadToHtml(opts, string) {
    if (!opts.isPublishedPage || "y" !== window.lazy || "yes" !== $("#allrecords").attr("data-tilda-lazy"))
        return string;
    var html = $("<div></div>").append(string);
    return html.find("img").each((function() {
        var image = $(this)
          , source = image.attr("src");
        if (image.addClass("t-img"),
        -1 == source.indexOf(".tildacdn.com") || source.indexOf("-/empty/") > 0 || source.indexOf("-/resize/") > 0)
            ;
        else {
            var arr = source.split("/");
            arr.splice(source.split("/").length - 1, 0, "-/empty");
            var newSrc = arr.join("/");
            image.attr("src", newSrc),
            image.attr("data-original", source)
        }
    }
    )),
    html.html()
}
function t_store_drawProdPopup_drawGallery(recid, el_popup, product, options) {
    var rec = $("#rec" + recid), galleryArr;
    if (product.gallery)
        if (0 !== (galleryArr = "string" == typeof product.gallery ? jQuery.parseJSON(product.gallery) : product.gallery).length) {
            var tpl, str = t_store_get_productcard_slider_html(rec, options), strSlides = "", strBullets = "", hasBullets = "thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls || "dots" === options.slider_opts.controls || "" === options.slider_opts.controls, hasThumbs = "thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls, columnSizeForMainImage = parseInt(options.popup_opts.columns, 10), galleryImageAspectRatio = +options.slider_slidesOpts.ratio, thumbsSize = 60, marginBetweenThumbs = 10, oneBulletTpl, oneBulletStr;
            $.each(galleryArr, (function(key, element) {
                var oneSlideTpl = t_store_get_productcard_oneSlide_html(options, element);
                if (strSlides += oneSlideTpl.replace("[[activeClass]]", 0 === key ? "t-slds__item_active" : "").replace("[[productClass]]", 0 === key ? "js-product-img" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, element.img)).replace(/\[\[imgsource\]\]/g, element.img),
                hasBullets)
                    if (hasThumbs && "l" == options.sliderthumbsside) {
                        var maxThumbsCount = t_store_prodPopup_gallery_calcMaxThumbsCount(columnSizeForMainImage, galleryImageAspectRatio, 60, 10);
                        key <= maxThumbsCount - 1 && (key <= maxThumbsCount - 2 || key === galleryArr.length - 1 ? (oneBulletTpl = t_store_get_productcard_oneSliderBullet_html(options),
                        oneBulletStr = oneBulletTpl.replace("[[activeClass]]", 0 === key ? "t-slds__bullet_active" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, element.img)).replace(/\[\[imgsource\]\]/g, element.img)) : (oneBulletTpl = t_store_get_productcard_thumbsGallery_html(options, galleryArr.length, maxThumbsCount),
                        oneBulletStr = oneBulletTpl.replace("[[activeClass]]", 0 === key ? "t-slds__bullet_active" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, element.img)).replace(/\[\[imgsource\]\]/g, element.img)),
                        strBullets += oneBulletStr)
                    } else
                        oneBulletTpl = t_store_get_productcard_oneSliderBullet_html(options),
                        oneBulletStr = oneBulletTpl.replace("[[activeClass]]", 0 === key ? "t-slds__bullet_active" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, element.img)).replace(/\[\[imgsource\]\]/g, element.img),
                        strBullets += oneBulletStr
            }
            )),
            str = str.replace("[[slides]]", strSlides),
            hasBullets && (str = str.replace("[[bullets]]", strBullets)),
            el_popup.find(".js-store-prod-slider").html(str),
            t_store_galleryVideoHandle(recid);
            var controlsSelStr = ".t-slds__arrow_container, .t-slds__bullet_wrapper, .t-slds__thumbsbullet-wrapper", sliderOptions, isSnippet;
            1 === galleryArr.length ? el_popup.find(controlsSelStr).hide() : el_popup.find(controlsSelStr).show(),
            "l" == options.sliderthumbsside && (sliderOptions = {
                thumbsbulletGallery: !0,
                storeOptions: options
            }),
            $.contains($("#allrecords")[0], $(".t-store__product-snippet")[0]) ? t_store_onFuncLoad("t_sldsInit", (function() {
                t_sldsInit(recid + " .js-store-product", sliderOptions)
            }
            )) : setTimeout((function() {
                t_store_onFuncLoad("t_sldsInit", (function() {
                    t_sldsInit(recid + " .js-store-product", sliderOptions)
                }
                ))
            }
            ), 200)
        } else
            el_popup.find(".js-store-prod-slider").html("");
    else
        el_popup.find(".js-store-prod-slider").html("")
}
function t_store_galleryVideoHandle(recid) {
    var el = $("#rec" + recid), play, url;
    el.find(".t-slds__play_icon").click((function() {
        "youtube.com" == $(this).attr("data-slider-video-type") && (url = $(this).attr("data-slider-video-url"),
        $(this).next().html('<iframe class="t-slds__frame" width="100%" height="100%" src="https://www.youtube.com/embed/' + url + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')),
        "vimeo.com" == $(this).attr("data-slider-video-type") && (url = $(this).attr("data-slider-video-url"),
        $(this).next().html('<iframe class="t-slds__frame" width="100%" height="100%" src="https://player.vimeo.com/video/' + url + '" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>')),
        $(this).next().css("z-index", "3")
    }
    )),
    el.on("updateSlider", (function() {
        t_store_galleryVideoClearFrame(recid)
    }
    ))
}
function t_store_galleryVideoClearFrame(recid) {
    var rec, frameWrapper = $("#rec" + recid).find(".t-slds__frame-wrapper");
    frameWrapper && frameWrapper.html("").css("z-index", "")
}
function t_store_prodPopup_updateGalleryThumbs(recid, el_popup, product, options) {
    var rec = $("#rec" + recid), galleryArr, hasThumbs;
    if (!("thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls) && "l" === options.sliderthumbsside && product.gallery)
        if (0 !== (galleryArr = "string" == typeof product.gallery ? jQuery.parseJSON(product.gallery) : product.gallery).length) {
            var columnSizeForMainImage = parseInt(options.popup_opts.columns, 10), galleryImageAspectRatio = +options.slider_slidesOpts.ratio, thumbsSize = 60, marginBetweenThumbs = 10, thumbsCount = rec.find(".t-slds__thumbsbullet").length, maxThumbsCount = t_store_prodPopup_gallery_calcMaxThumbsCount(columnSizeForMainImage, galleryImageAspectRatio, 60, 10), strBullets, oneBulletTpl, oneBulletStr, thumbsWrapper, sliderOptions;
            if (thumbsCount !== maxThumbsCount && galleryArr.length >= maxThumbsCount || thumbsCount < maxThumbsCount && thumbsCount !== galleryArr.length)
                $.each(galleryArr, (function(key, image) {
                    key <= maxThumbsCount - 1 && (key <= maxThumbsCount - 2 || key === galleryArr.length - 1 ? (oneBulletTpl = t_store_get_productcard_oneSliderBullet_html(options),
                    oneBulletStr = oneBulletTpl.replace("[[activeClass]]", 0 === key ? "t-slds__bullet_active" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, image.img)).replace(/\[\[imgsource\]\]/g, image.img)) : (oneBulletTpl = t_store_get_productcard_thumbsGallery_html(options, galleryArr.length, maxThumbsCount),
                    oneBulletStr = oneBulletTpl.replace("[[activeClass]]", 0 === key ? "t-slds__bullet_active" : "").replace(/\[\[index\]\]/g, key + 1).replace(/\[\[imgsource_lazy\]\]/g, t_store_getLazyUrl(options, image.img)).replace(/\[\[imgsource\]\]/g, image.img)),
                    strBullets += oneBulletStr)
                }
                )),
                rec.find(".t-slds__thumbsbullet-wrapper").html(strBullets),
                "l" == options.sliderthumbsside && (sliderOptions = {
                    thumbsbulletGallery: !0,
                    storeOptions: options
                }),
                t_sldsInit(recid + " .js-store-product", sliderOptions),
                "y" !== window.lazy && "yes" !== $("#allrecords").attr("data-tilda-lazy") || t_store_onFuncLoad("t_lazyload_update", (function() {
                    t_lazyload_update()
                }
                ))
        } else
            el_popup.find(".js-store-prod-slider").html("")
}
function t_store_prodPopup_gallery_calcMaxThumbsCount(columnSize, galleryImageRatio, thumbSize, marginBetweenThumbs) {
    var columnWidth = t_store_getColumnWidth(columnSize)
      , windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    windowWidth >= 960 && windowWidth <= 1240 && (columnWidth = 440);
    var mainImageHeightPercent = Math.floor(100 * galleryImageRatio)
      , mainImageHeight = Math.floor(mainImageHeightPercent * (columnWidth - (thumbSize + marginBetweenThumbs)) / 100)
      , maxPreviewsCount = Math.floor(mainImageHeight / (thumbSize + marginBetweenThumbs));
    return (thumbSize + marginBetweenThumbs) * (maxPreviewsCount + 1) - marginBetweenThumbs <= mainImageHeight && (maxPreviewsCount += 1),
    maxPreviewsCount
}
function t_store_get_productcard_slider_html(rec, options) {
    var str = ""
      , animationduration = "t-slds_animated-none"
      , animationspeed = "300";
    "fast" === options.slider_opts.anim_speed && (animationduration = "t-slds_animated-fast"),
    "slow" === options.slider_opts.anim_speed && (animationduration = "t-slds_animated-slow",
    animationspeed = "500");
    var thumbsbulletsWithGallerClass = "", hasThumbs;
    if (("thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls) && "l" == options.sliderthumbsside && (thumbsbulletsWithGallerClass = "t-slds__thumbsbullets-with-gallery"),
    str += '<div class="t-slds ' + thumbsbulletsWithGallerClass + '" style="visibility: hidden;">',
    str += '    <div class="t-slds__main">',
    str += '        <div class="t-slds__container" [[containerStyles]]>',
    str += '            <div class="t-slds__items-wrapper ' + animationduration + ' [[noCycleClass]]" data-slider-transition="' + animationspeed + '" data-slider-with-cycle="[[isCycled]]" data-slider-correct-height="true" data-auto-correct-mobile-width="false">',
    str += "                [[slides]]",
    str += "            </div>",
    str += "            [[arrows]]",
    str += "        </div>",
    str += "    </div>",
    str += "    [[bullets]]",
    str += "</div>",
    "arrows" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls || "" === options.slider_opts.controls) {
        var arrowsTplEl, arrowsTpl = rec.find(".js-store-tpl-slider-arrows").html(), arrowsWrapperClass;
        arrowsTpl = '<div class="' + ("t-slds__arrow_container " + ("" === options.slider_opts.cycle ? "t-slds__nocycle" : "")) + '">' + arrowsTpl + "</div>",
        str = str.replace("[[arrows]]", arrowsTpl)
    } else
        str = str.replace("[[arrows]]", "");
    if ("thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls) {
        var tpl = '<div class="t-slds__thumbsbullet-wrapper ' + ("contain" === options.slider_slidesOpts.bgsize ? "t-align_center" : "") + '">[[bullets]]</div>';
        str = str.replace("[[bullets]]", tpl)
    } else
        str = "dots" === options.slider_opts.controls || "" === options.slider_opts.controls ? str.replace("[[bullets]]", '<div class="t-slds__bullet_wrapper">[[bullets]]</div>') : str.replace("[[bullets]]", "");
    return str = str.replace("[[containerStyles]]", options.slider_opts.bgcolor ? 'style="background-color:' + options.slider_opts.bgcolor + ';"' : "").replace("[[noCycleClass]]", options.slider_opts.cycle ? "" : "t-slds__nocycle").replace("[[isCycled]]", options.slider_opts.cycle ? "true" : "false")
}
function t_store_get_productcard_oneSlide_html(options, element) {
    var iconColor = options.slider_opts.videoPlayerIconColor || "#fff"
      , str = "";
    return str += '<div class="t-slds__item [[activeClass]]" data-slide-index="[[index]]">',
    str += '    <div class="t-slds__wrapper" itemscope itemtype="http://schema.org/ImageObject">',
    str += '        <meta itemprop="image" content="[[imgsource]]">',
    str += '        <div class="t-slds__imgwrapper [[zoomClass]]" [[zoomAttrs]]>',
    str += '            <div class="t-slds__bgimg [[containClass]] t-bgimg [[productClass]]" data-original="[[imgsource]]" style="padding-bottom:[[paddingBottomVal]]; background-image: url(\'[[imgsource_lazy]]\');">',
    str += "            </div>",
    str += "         </div>",
    element.video && (str += '<div class="t-slds__videowrapper">',
    str += '<div class="t-slds__play_icon" data-slider-video-url="' + element.videoid + '"  data-slider-video-type="' + element.vtype + '" style="width:70px; height: 70px; ">',
    str += '<svg width="70px" height="70px" viewBox="0 0 60 60">',
    str += '<g stroke="none" stroke-width="1" fill="" fill-rule="evenodd">',
    str += '<g transform="translate(-691.000000, -3514.000000)" fill="' + iconColor + '">',
    str += '<path d="M721,3574 C737.568542,3574 751,3560.56854 751,3544 C751,3527.43146 737.568542,3514 721,3514 C704.431458,3514 691,3527.43146 691,3544 C691,3560.56854 704.431458,3574 721,3574 Z M715,3534 L732,3544.5 L715,3555 L715,3534 Z"></path>',
    str += "</g>",
    str += "</g>",
    str += "</svg>",
    str += "</div>",
    str += '<div class="t-slds__frame-wrapper"></div>',
    str += "</div>"),
    str += "    </div>",
    str = (str += "</div>").replace("[[zoomAttrs]]", options.slider_slidesOpts.zoomable ? 'data-zoom-target="[[index]]" data-zoomable="yes" data-img-zoom-url="[[imgsource]]"' : "").replace("[[zoomClass]]", options.slider_slidesOpts.zoomable ? "t-zoomable" : "").replace("[[containClass]]", "contain" === options.slider_slidesOpts.bgsize ? "t-slds__bgimg-contain" : "").replace("[[paddingBottomVal]]", 100 * options.slider_slidesOpts.ratio + "%")
}
function t_store_get_productcard_oneSliderBullet_html(options) {
    var str = "";
    if ("thumbs" !== options.slider_opts.controls && "arrowsthumbs" !== options.slider_opts.controls || (str += '<div class="t-slds__thumbsbullet t-slds__bullet [[activeClass]]" data-slide-bullet-for="[[index]]">',
    str += '    <div class="t-slds__bgimg t-bgimg" data-original="[[imgsource]]" style="padding-bottom: 100%; background-image: url(\'[[imgsource_lazy]]\');"></div>',
    str += '    <div class="t-slds__thumbsbullet-border"></div>',
    str += "</div>"),
    "dots" === options.slider_opts.controls || "" === options.slider_opts.controls) {
        str += '<div class="t-slds__bullet [[activeClass]]" data-slide-bullet-for="[[index]]">',
        str += '    <div class="t-slds__bullet_body" [[styles]]></div>',
        str += "</div>";
        var styles = "";
        if (options.slider_dotsOpts.size) {
            var size = parseInt(options.slider_dotsOpts.size, 10);
            styles += "width:" + (size = size > 20 ? 20 : size) + "px;height:" + size + "px;"
        }
        if (options.slider_dotsOpts.bgcolor && (styles += "background-color:" + options.slider_dotsOpts.bgcolor + ";"),
        options.slider_dotsOpts.bordersize) {
            var borderColor = options.slider_dotsOpts.bgcoloractive ? options.slider_dotsOpts.bgcoloractive : "#222";
            styles += "border: " + options.slider_dotsOpts.bordersize + " solid " + borderColor + ";"
        }
        str = str.replace("[[styles]]", "" !== styles ? 'style="' + styles + '"' : "")
    }
    return str
}
function t_store_get_productcard_thumbsGallery_html(options, galleryLength, maxThumbsCount) {
    var str = ""
      , countForGalleryPreview = galleryLength - maxThumbsCount;
    if ("thumbs" === options.slider_opts.controls || "arrowsthumbs" === options.slider_opts.controls) {
        var classes = "t-slds__thumbsbullet t-slds__bullet t-slds__thumbs_gallery [[activeClass]]";
        options.slider_slidesOpts.zoomable && (classes += " t-slds__thumbs_gallery-zoomable"),
        str += '<div class="' + classes + '" [[zoomAttrs]] data-gallery-length="' + countForGalleryPreview + '" data-slide-bullet-for="' + maxThumbsCount + '">',
        str += '    <div class="t-slds__bgimg t-bgimg" data-original="[[imgsource]]" style="padding-bottom: 100%; background-image: url(\'[[imgsource_lazy]]\');"></div>',
        str += '    <div class="t-slds__thumbsbullet-border"></div>',
        str = (str += "</div>").replace("[[zoomAttrs]]", options.slider_slidesOpts.zoomable ? 'data-zoom-target="[[index]]" data-zoomable="yes" data-img-zoom-url="[[imgsource]]"' : "")
    }
    return str
}
function t_store_getLazyUrl(opts, imgSrc) {
    if (!opts.isPublishedPage || "y" !== window.lazy)
        return imgSrc;
    if (-1 === imgSrc.indexOf("static.tildacdn.com"))
        return imgSrc;
    var arr = imgSrc.split("/"), newSrc;
    return arr.splice(imgSrc.split("/").length - 1, 0, "-/resizeb/x20"),
    arr.join("/")
}
function t_store_getLazySrc(opts, imgSrc) {
    if (!opts.isPublishedPage || "y" !== window.lazy)
        return 'src="' + imgSrc + '"';
    if (-1 == imgSrc.indexOf(".tildacdn.com") || imgSrc.indexOf("-/empty/") > 0 || imgSrc.indexOf("-/resize/") > 0)
        return 'src="' + imgSrc + '" ';
    var arr = imgSrc.split("/"), newSrc;
    return arr.splice(imgSrc.split("/").length - 1, 0, "-/empty"),
    'src="' + arr.join("/") + '" data-original="' + imgSrc + '"'
}
function t_store_dict(msg) {
    var dict = [];
    dict.sku = {
        EN: "SKU",
        RU: "Артикул",
        FR: "UGS",
        DE: "SKU",
        ES: "SKU",
        PT: "SKU",
        UK: "Код товару",
        JA: "単品管理",
        ZH: "存货单位",
        PL: "SKU",
        KK: "SKU",
        IT: "SKU",
        LV: "SKU"
    },
    dict.soldOut = {
        EN: "Out of stock",
        RU: "Нет в наличии",
        FR: "En rupture de stock",
        DE: "Ausverkauft",
        ES: "Agotado",
        PT: "Fora de estoque",
        UK: "Немає в наявності",
        JA: "在庫切れ",
        ZH: "缺货",
        PL: "Nie ma na stanie",
        KK: "Сатылды",
        IT: "Esaurito",
        LV: "Nav noliktavā"
    },
    dict.all = {
        EN: "All",
        RU: "Все",
        FR: "Tout",
        DE: "Alles",
        ES: "Todos",
        PT: "Todos",
        UK: "Всі",
        JA: "すべて",
        ZH: "所有",
        PL: "Wszystkie",
        KK: "Барлық",
        IT: "Tutti",
        LV: "Visi"
    },
    dict.from = {
        EN: "from",
        RU: "от",
        FR: "de",
        DE: "von",
        ES: "de",
        PT: "de",
        JA: "から",
        ZH: "从",
        UK: "від",
        PL: "od",
        KK: "бастап",
        IT: "da",
        LV: "no"
    },
    dict.emptypartmsg = {
        EN: "Nothing found",
        RU: "Ничего не найдено",
        FR: "Rien trouvé",
        DE: "Nichts gefunden",
        ES: "Nada encontrado",
        PT: "Nada encontrado",
        UK: "Нічого не знайдено",
        JA: "何も見つかりませんでした",
        ZH: "什么都没找到",
        PL: "Nic nie znaleziono",
        KK: "Ештеңе табылмады",
        IT: "Non abbiamo trovato nulla",
        LV: "Nekas nav atrasts"
    },
    dict.seeotherproducts = {
        EN: "See other",
        RU: "Другие товары",
        FR: "Autres produits",
        DE: "Andere produkte",
        ES: "Otros productos",
        PT: "Outros produtos",
        UK: "Інші товари",
        JA: "その他の商品",
        ZH: "其他产品",
        PL: "Inne produkty",
        KK: "Басқа қараңыз",
        IT: "Vedi altri",
        LV: "Skatiet citas"
    },
    dict.seeAlso = {
        EN: "See also",
        RU: "Смотрите также",
        FR: "Voir également",
        DE: "Siehe auch",
        ES: "Ver también",
        PT: "Veja também",
        UK: "Дивись також",
        JA: "また見なさい",
        ZH: "也可以看看",
        PL: "Patrz również",
        KK: "Сондай-ақ, қараңыз",
        IT: "Guarda anche",
        LV: "Skatīt arī"
    },
    dict.addtocart = {
        EN: "Buy now",
        RU: "Купить",
        FR: "Acheter",
        DE: "Zu kaufen",
        ES: "Para comprar",
        PT: "Comprar",
        UK: "Купити",
        JA: "購入する",
        ZH: "要买",
        PL: "Kup",
        KK: "Қазір сатып Ал",
        IT: "Acquista ora",
        LV: "Pērc tagad"
    },
    dict.loadmore = {
        EN: "Load more",
        RU: "Загрузить еще",
        FR: "Charger plus",
        DE: "Mehr laden",
        ES: "Carga más",
        PT: "Carregue mais",
        UK: "Завантажити ще",
        JA: "もっと読み込む",
        ZH: "裝載更多",
        PL: "Pokaż więcej",
        KK: "Load көп",
        IT: "Carica ancora",
        LV: "Ielādēt vairāk"
    },
    dict.filters = {
        EN: "Filters",
        RU: "Фильтры",
        FR: "Filtres",
        DE: "Filter",
        ES: "Filtros",
        PT: "Filtros",
        UK: "Фільтри",
        JA: "フィルター",
        ZH: "过滤器",
        PL: "Filtry",
        KK: "Сүзгілер",
        IT: "Filtri",
        LV: "Filtri"
    },
    dict.searchplaceholder = {
        EN: "Search",
        RU: "Поиск",
        FR: "Recherche de produit",
        DE: "Produktsuche",
        ES: "Buscar productos",
        PT: "Procurar produtos",
        UK: "Пошук товарів",
        JA: "商品を探す",
        ZH: "搜索商品",
        PL: "Wyszukaj produkt",
        KK: "Іздеу",
        IT: "Ricerca",
        LV: "Meklēt"
    },
    dict["sort-label"] = {
        EN: "Sort",
        RU: "Сортировка",
        FR: "Trier",
        DE: "Sortieren nach",
        ES: "Ordenar",
        PT: "Ordenar",
        UK: "Сортування",
        JA: "並べ替え",
        ZH: "分类",
        PL: "Sortuj",
        KK: "Сорт",
        IT: "Ordinare",
        LV: "Šķirot"
    },
    dict["sort-default"] = {
        EN: "Sort: by default",
        RU: "Порядок: по умолчанию",
        FR: "Trier: par défaut",
        DE: "Sortieren nach: Standardmäßig",
        ES: "Ordenar: por defecto",
        PT: "Ordenar: por padrão",
        UK: "Сортування: за замовчуванням",
        JA: "並べ替え：デフォルトで",
        ZH: "分类: 默认",
        PL: "Sortuj: dowolnie",
        KK: "Сұрыптау: Әдепкі бойынша",
        IT: "Ordina: per impostazione predefinita",
        LV: "Kārtot: pēc noklusējuma"
    },
    dict["sort-price-asc"] = {
        EN: "Price: low to high",
        RU: "Цена: по возрастанию",
        FR: "Prix: par ordre croissant",
        DE: "Preis: aufsteigend",
        ES: "Precio: de más bajo a más alto",
        PT: "Preço: baixo para alto",
        UK: "Ціна: спочатку дешеві",
        JA: "価格の安い順番",
        ZH: "价格: 从便宜到贵",
        PL: "Cena: od najniższej",
        KK: "Бағасы: жоғары төмен",
        IT: "Prezzo crescente",
        LV: "Cena: no zema uz augstu"
    },
    dict["sort-price-desc"] = {
        EN: "Price: high to low",
        RU: "Цена: по убыванию",
        FR: "Prix: par ordre décroissant",
        DE: "Preis: absteigend",
        ES: "Precio: de más alto a más bajo",
        PT: "Preço: alto para baixo",
        UK: "Ціна: спочатку дорогі ",
        JA: "価格の高い順番",
        ZH: "价格: 从贵到便宜",
        PL: "Cena: od najdroższej",
        KK: "Бағасы: төмен жоғары",
        IT: "Prezzo decrescente",
        LV: "Cena: no augstākās līdz zemākajai"
    },
    dict["sort-name-asc"] = {
        EN: "Title: A—Z",
        RU: "Название: А—Я",
        FR: "Titre: A—Z",
        DE: "Titel: A—Z",
        ES: "Título: A—Z",
        PT: "Título: A—Z",
        UK: "Назва:  А—Я",
        JA: "製品名：五十音順",
        ZH: "商品名称: 字母顺序排列",
        PL: "Nazwa: A-Ż",
        KK: "Атауы: A-Z",
        IT: "Titolo: A-Z",
        LV: "Nosaukums: A-Z"
    },
    dict["sort-name-desc"] = {
        EN: "Title: Z—A",
        RU: "Название: Я—А",
        FR: "Titre: Z—A",
        DE: "Titel: Z—A",
        ES: "Título: Z—A",
        PT: "Título: Z—A",
        UK: "Назва: Я—А",
        JA: "製品名：降順",
        ZH: "商品名称: 降序母顺序排列",
        PL: "Nazwa: Ż-A",
        KK: "Атауы: Z-A",
        IT: "Titolo: Z-A",
        LV: "Nosaukums: no Z līdz A"
    },
    dict["sort-created-desc"] = {
        EN: "Sort: newest first",
        RU: "Порядок: сперва новые",
        FR: "Trier: le plus récent en premier",
        DE: "Sortieren nach: Neueste zuerst",
        ES: "Ordenar: más nuevos primero",
        PT: "Ordenar: mais recente primeiro",
        UK: "Сортувати: спочатку нові",
        JA: "最新のものから並べ替え",
        ZH: "分类: 最新的",
        PL: "Sortuj: najnowsze",
        KK: "Сұрыптау: Бірінші жаңалар Бірінші",
        IT: "Nuovi primo",
        LV: "Kārtot: jaunākie vispirms"
    },
    dict["sort-created-asc"] = {
        EN: "Sort: oldest first",
        RU: "Порядок: сперва старые",
        FR: "Trier: le plus ancien en premier",
        DE: "Sortieren nach: Älteste zuerst",
        ES: "Ordenar: el más antiguo primero",
        PT: "Ordenar: mais antigo primeiro",
        UK: "Сортування: спочатку старі",
        JA: "並べ替え：古いものから",
        ZH: "分类: 最早的",
        PL: "Sortuj: najstarsze",
        KK: "Сұрыптау: көне бірінші",
        IT: "Ordina: prima i più vecchi",
        LV: "Kārtot: vecākie vispirms"
    },
    dict["filter-price-name"] = {
        EN: "Price",
        RU: "Цена",
        FR: "Prix",
        DE: "Preis",
        ES: "Precio",
        PT: "Preço",
        UK: "Ціна",
        JA: "価格",
        ZH: "价格",
        PL: "Cena",
        KK: "Баға",
        IT: "Prezzo",
        LV: "Cena"
    },
    dict["filter-available-name"] = {
        EN: "Availability",
        RU: "Наличие",
        FR: "Disponibilité",
        DE: "Verfügbarkeit",
        ES: "Disponibilidad",
        PT: "Disponibilidade",
        UK: "Наявність",
        JA: "可用性",
        ZH: "可用性",
        PL: "Dostępność",
        KK: "Болуы",
        IT: "Disponibilità",
        LV: "Pieejamība"
    },
    dict["filter-available-label"] = {
        EN: "Only in stock",
        RU: "Только товары в наличии",
        FR: "Seulement articles en stock",
        DE: "Nur auf Lager",
        ES: "Solo artículos en stock",
        PT: "Apenas itens em estoque",
        UK: "Тільки товари в наявності",
        JA: "在庫品のみ",
        ZH: "只有货",
        PL: "Tylko dostępne produkty",
        KK: "Тек қоймада",
        IT: "Solo in magazzino",
        LV: "Tikai noliktavā"
    },
    dict["filter-reset"] = {
        EN: "Clear all",
        RU: "Очистить все",
        FR: "Tout effacer",
        DE: "Alles löschen",
        ES: "Limpiar todo",
        PT: "Limpar tudo",
        UK: "Очистити все",
        JA: "すべてクリア",
        ZH: "全部清除",
        PL: "Wyczyść wszystko",
        KK: "Clear Барлық",
        IT: "Cancella tutto",
        LV: "Nodzēst visu"
    },
    dict["filter-expand"] = {
        EN: "Show all",
        RU: "Показать все",
        FR: "Afficher tout",
        DE: "Zeige alles",
        ES: "Mostrar todo",
        PT: "Pokaż wszystko",
        UK: "Показати всі",
        JA: "すべて表示する",
        ZH: "显示所有",
        PL: "Pokaż wszystko",
        KK: "Барлығын көрсету",
        IT: "Mostra tutto",
        LV: "Parādīt visu"
    },
    dict["filter-collapse"] = {
        EN: "Collapse",
        RU: "Свернуть",
        FR: "Effondrer",
        DE: "Zusammenbruch",
        ES: "Colapso",
        PT: "Zawalić się",
        UK: "Згорнути",
        JA: "崩壊",
        ZH: "坍方",
        PL: "Zwiń",
        KK: "Күйреу",
        IT: "Crollo",
        LV: "Sabrukums"
    },
    dict["filter-prodsnumber"] = {
        EN: "Found",
        RU: "Найдено",
        FR: "Trouvé",
        DE: "Gefunden",
        ES: "Encontrado",
        PT: "Encontrado",
        UK: "Знайдено",
        JA: "見つかった",
        ZH: "发现",
        PL: "Znaleziono",
        KK: "Табылған",
        IT: "Trovato",
        LV: "Atrasts"
    },
    dict.mm = {
        EN: "mm",
        RU: "мм",
        FR: "mm",
        DE: "mm",
        ES: "mm",
        PT: "mm",
        UK: "мм",
        JA: "mm",
        ZH: "mm",
        PL: "mm",
        KK: "мм",
        IT: "mm",
        LV: "mm"
    },
    dict.g = {
        EN: "g",
        RU: "г",
        FR: "g",
        DE: "g",
        ES: "g",
        PT: "g",
        UK: "г",
        JA: "g",
        ZH: "g",
        PL: "r",
        KK: "г",
        IT: "g",
        LV: "g"
    },
    dict.PCE = {
        EN: "pc",
        RU: "шт"
    },
    dict.NMP = {
        EN: "pack",
        RU: "уп"
    },
    dict.MGM = {
        EN: "mg",
        RU: "мг"
    },
    dict.GRM = {
        EN: "g",
        RU: "г"
    },
    dict.KGM = {
        EN: "kg",
        RU: "кг"
    },
    dict.TNE = {
        EN: "t",
        RU: "т"
    },
    dict.MLT = {
        EN: "ml",
        RU: "мл"
    },
    dict.LTR = {
        EN: "l",
        RU: "л"
    },
    dict.MMT = {
        EN: "mm",
        RU: "мм"
    },
    dict.CMT = {
        EN: "cm",
        RU: "см"
    },
    dict.DMT = {
        EN: "dm",
        RU: "дм"
    },
    dict.MTR = {
        EN: "m",
        RU: "м"
    },
    dict.MTK = {
        EN: "m²",
        RU: "м²"
    },
    dict.MTQ = {
        EN: "m³",
        RU: "м³"
    },
    dict.LMT = {
        EN: "lm",
        RU: "пог. м"
    },
    dict.HAR = {
        EN: "ha",
        RU: "га"
    },
    dict.ACR = {
        EN: "acre",
        RU: "акр"
    },
    dict["product-lwh"] = {
        EN: "LxWxH",
        RU: "ДxШxВ",
        FR: "LxWxH",
        DE: "LxBxH",
        ES: "PxLxK",
        PT: "LxWxH",
        UK: "ДxШxВ",
        JA: "LxWxH",
        ZH: "LxWxH",
        PL: "LxWxH",
        KK: "LxWxH",
        IT: "LxWxH",
        LV: "LxWxH"
    },
    dict["product-wht"] = {
        EN: "WxHxT",
        RU: "ШxВxТ",
        FR: "LxHxÉ",
        DE: "BxHxD",
        ES: "LxKxP",
        PT: "LxAxE",
        UK: "ШxВxТ",
        JA: "WxHxT",
        ZH: "WxHxT",
        PL: "WxHxT",
        KK: "WxHxT",
        IT: "WxHxT",
        LV: "WxHxT"
    },
    dict["product-whd"] = {
        EN: "WxHxD",
        RU: "ШxВxГ",
        FR: "LxHxP",
        DE: "BxHxT",
        ES: "LxKxS",
        PT: "LxAxP",
        UK: "ШxВxГ",
        JA: "WxHxD",
        ZH: "WxHxD",
        PL: "WxHxD",
        KK: "WxHxD",
        IT: "WxHxD",
        LV: "WxHxD"
    },
    dict["product-weight"] = {
        EN: "Weight",
        RU: "Вес",
        FR: "Poids",
        DE: "Gewicht",
        ES: "Kaal",
        PT: "Peso",
        UK: "Вага",
        JA: "重さ",
        ZH: "機重",
        PL: "Waga",
        KK: "Салмақ",
        IT: "Peso",
        LV: "Svars"
    };
    var lang = window.browserLang;
    return void 0 !== dict[msg] ? void 0 !== dict[msg][lang] && "" != dict[msg][lang] ? dict[msg][lang] : dict[msg].EN : 'Text not found "' + msg + '"'
}
function t_store_escapeQuote(text) {
    if (!text)
        return "";
    var map = {
        '"': "&quot;",
        "'": "&#039;"
    };
    return text.replace(/["']/g, (function(m) {
        return map[m]
    }
    ))
}
function t_store_product_initEditions(recid, product, el_product, options) {
    var optionsWrapper = el_product.find(".js-product-controls-wrapper"), hasAvailable;
    t_store_product_addEditionControls(product, optionsWrapper, options, recid),
    t_store_product_selectAvailableEdition(recid, product, el_product, options) ? (t_store_product_triggerSoldOutMsg(el_product, !1, options),
    t_store_product_disableUnavailOpts(el_product, product)) : t_store_product_triggerSoldOutMsg(el_product, !0, options),
    el_product.find(".js-product-edition-option").on("change", (function() {
        var edition = t_store_product_detectEditionByControls(el_product, product)
          , isChanged = !0;
        if (edition) {
            t_store_product_updateEdition(recid, el_product, edition, product, options, !0),
            t_prod__updatePrice(recid, el_product);
            var isSoldOut = parseInt(edition.quantity, 10) <= 0;
            t_store_product_triggerSoldOutMsg(el_product, isSoldOut, options),
            t_store_addProductQuantity(recid, el_product, edition, options)
        } else {
            for (var el_changedOpt, changedOptName = $(this).attr("data-edition-option-id"), optsValsBeforeChangedArr = [], i = 0; i < product.editionOptions.length; i++) {
                var curOption = product.editionOptions[i];
                if (optsValsBeforeChangedArr.push(curOption),
                curOption.name === changedOptName)
                    break
            }
            var hasAvailable = t_store_product_selectAvailableEdition(recid, product, el_product, options, optsValsBeforeChangedArr, !0);
            t_prod__updatePrice(recid, el_product),
            t_store_product_triggerSoldOutMsg(el_product, !hasAvailable, options),
            t_store_addProductQuantity(recid, el_product, product, options)
        }
        el_product.find(".js-product-edition-option-variants option").removeAttr("disabled"),
        t_store_product_disableUnavailOpts(el_product, product)
    }
    ))
}
function t_store_product_detectEditionByControls(el_product, product) {
    for (var i = 0; i < product.editions.length; i++) {
        for (var curEdition = product.editions[i], isCurEditionSelected = !0, j = 0; j < product.editionOptions.length; j++) {
            var curOption = product.editionOptions[j], el_select, curControlVal, curEditionVal;
            t_store_product_getEditionSelectEl(el_product, curOption).find(".js-product-edition-option-variants").val() !== curEdition[curOption.name] && (isCurEditionSelected = !1)
        }
        if (isCurEditionSelected)
            return curEdition
    }
    return null
}
function t_store_product_addEditionControls(product, optionsWrapper, options, recid) {
    var optionsData = t_store_option_getOptionsData()
      , firstAvailabeEdition = t_store_product_getFirstAvailableEditionData(product.editions);
    product.editionOptions || (product.editionOptions = t_store_product_getEditionOptionsArr(product, optionsData)),
    product.editionOptions.forEach((function(curOption) {
        t_store_product_addOneOptionsControl("editionopt", curOption, optionsWrapper, options, firstAvailabeEdition, recid)
    }
    ))
}
function t_store_product_selectAvailableEdition(recid, product, el_product, opts, optsValsBeforeChangedArr, isChanged) {
    var edition = optsValsBeforeChangedArr && optsValsBeforeChangedArr.length > 0 ? t_store_product_getFirstAvailableEditionData_forCertainVals(product.editions, optsValsBeforeChangedArr, el_product) : t_store_product_getFirstAvailableEditionData(product.editions);
    if (!edition)
        return console.log("No available edition for uid = " + product.uid + " with selected options values"),
        !1;
    var isAvailable = parseInt(edition.quantity, 10) > 0 || "" === edition.quantity;
    return product.editionOptions.forEach((function(curOption) {
        var value = edition[curOption.name]
          , el_select = t_store_product_getEditionSelectEl(el_product, curOption);
        el_select.find(".js-product-edition-option-variants").val(value);
        var el_custom_opts = el_select.find(".t-product__option-variants_custom"), el_items;
        el_custom_opts.length && el_custom_opts.find(".t-product__option-item").each((function() {
            var el_input = $(this).find(".t-product__option-input");
            el_input.val() === value ? (setTimeout((function() {
                el_input.prop("checked", !0).click()
            }
            )),
            $(this).addClass("t-product__option-item_active")) : (el_input.prop("checked", !1),
            $(this).removeClass("t-product__option-item_active"))
        }
        ))
    }
    )),
    t_store_product_updateEdition(recid, el_product, edition, product, opts, isChanged),
    isAvailable
}
function t_store_product_disableUnavailOpts(el_product, product) {
    var optsValsBeforeChangedArr = [];
    product.editionOptions.length > 0 && optsValsBeforeChangedArr.push(product.editionOptions[0]);
    for (var i = 1; i < product.editionOptions.length; i++) {
        var curOpt = product.editionOptions[i]
          , el_curOpt = t_store_product_getEditionSelectEl(el_product, curOpt);
        optsValsBeforeChangedArr.push(curOpt),
        curOpt.values.forEach((function(curOptVal) {
            var hasEdition = t_store_product_getFirstAvailableEditionData_forCertainVals(product.editions, optsValsBeforeChangedArr, el_product, curOptVal), el_optionTag = el_curOpt.find('option[value="' + (curOptVal || "").replace(/\\/g, "\\\\") + '"]'), el_custom_input = el_curOpt.find('.t-product__option-input[value="' + (curOptVal || "").replace(/\\/g, "\\\\") + '"]'), el_parent, el_parent;
            hasEdition ? (el_optionTag.removeAttr("disabled"),
            el_custom_input.length && (el_parent = el_custom_input.closest(".t-product__option-item")).removeClass("t-product__option-item_disabled")) : (el_optionTag.attr("disabled", "disabled"),
            el_custom_input.length && ((el_parent = el_custom_input.closest(".t-product__option-item")).addClass("t-product__option-item_disabled"),
            el_parent.removeClass("t-product__option-item_active")))
        }
        ))
    }
}
function t_store_product_updateEdition(recid, el_product, edition, product, opts, isChanged) {
    var urlSearch = t_store_snippet_getJsonFromUrl();
    if (edition || product.editions.forEach((function(cur) {
        cur.uid === urlSearch.editionuid && (edition = cur)
    }
    )),
    urlSearch.editionuid === edition.uid && ($(".js-store-product").attr("data-product-lid", edition.uid),
    $(".js-store-product").attr("data-product-uid", edition.uid),
    $(".js-store-product").attr("data-product-url", window.location),
    setTimeout((function() {
        t_store_product_updateEdition_moveSlider(recid, el_product, edition)
    }
    ), 200),
    $(".js-store-product").attr("data-product-img", edition.img),
    $('[data-product-uid="' + edition.uid + '"] .js-product-edition-option').each((function() {
        var name = $(this).attr("data-edition-option-id");
        if (edition[name]) {
            var value = edition[name]
              , el_select = $(this).find(".js-product-edition-option-variants");
            el_select.val() !== value && el_select.val(value).change()
        }
    }
    ))),
    edition.price && 0 !== parseFloat(edition.price)) {
        var formattedPrice = t_store__getFormattedPrice(opts, edition.price)
          , formattedPriceRange = t_store__getFormattedPriceRange(opts, product);
        if (formattedPrice = formattedPriceRange || formattedPrice,
        el_product.find(".js-store-prod-price-val").html(formattedPrice),
        el_product.find(".js-store-prod-price").show(),
        t_store_onFuncLoad("t_prod__cleanPrice", (function() {
            var cleanPrice = t_prod__cleanPrice(edition.price);
            el_product.find(".js-product-price").attr("data-product-price-def", cleanPrice),
            el_product.find(".js-product-price").attr("data-product-price-def-str", cleanPrice),
            el_product.find(".js-product-price").attr("data-product-price-def-str", cleanPrice)
        }
        )),
        el_product.find(".t-store__prod__price-portion").remove(),
        product.portion > 0) {
            var str = '<div class="t-store__prod__price-portion">/';
            "1" !== product.portion && (str += +product.portion + " "),
            str += t_store_dict(product.unit) + "</div>",
            el_product.find(".t-store__card__price-currency + .js-product-price, .js-product-price + .t-store__card__price-currency").after(str),
            el_product.find(".t-store__prod-popup__price-currency + .js-product-price, .js-product-price + .t-store__prod-popup__price-currency").after(str)
        }
    } else
        el_product.find(".js-store-prod-price").hide(),
        el_product.find(".js-store-prod-price-val").html(""),
        el_product.find(".js-product-price").attr("data-product-price-def", ""),
        el_product.find(".js-product-price").attr("data-product-price-def-str", ""),
        el_product.find(".t-store__prod__price-portion").remove();
    if (edition.priceold && "0" !== edition.priceold) {
        var formattedPriceOld = t_store__getFormattedPrice(opts, edition.priceold);
        el_product.find(".js-store-prod-price-old").show(),
        el_product.find(".t-store__card__price_old").show(),
        el_product.find(".js-store-prod-price-old-val").html(formattedPriceOld)
    } else
        el_product.find(".js-store-prod-price-old").hide(),
        el_product.find(".t-store__card__price_old").hide(),
        el_product.find(".js-store-prod-price-old-val").html("");
    var el_brandWrapper = el_product.find(".t-store__prod-popup__brand");
    product.brand && product.brand > "" && (1 == el_brandWrapper.find("span[itemprop=brand]").length ? el_brandWrapper.find("span[itemprop=brand]").html(product.brand) : el_brandWrapper.html('<span itemprop="brand" class="js-product-brand">' + product.brand + "</span>")),
    product.brand || el_brandWrapper.hide();
    var el_skuWrapper = el_product.find(".t-store__prod-popup__sku")
      , el_sku = el_product.find(".js-store-prod-sku");
    edition.sku ? (el_sku.html(edition.sku),
    "large" === el_product.data("cardSize") && (el_sku.show(),
    el_skuWrapper.show())) : (el_sku.html("").hide(),
    el_skuWrapper.hide()),
    el_product.attr("data-product-inv", edition.quantity),
    el_product.attr("data-product-lid", edition.uid).attr("data-product-uid", edition.uid);
    try {
        var defpackobj = el_product.data("def-pack-obj");
        if (edition.pack_x && edition.pack_y && edition.pack_z) {
            defpackobj || (defpackobj = {
                pack_x: el_product.attr("data-product-pack-x") || 0,
                pack_y: el_product.attr("data-product-pack-y") || 0,
                pack_z: el_product.attr("data-product-pack-z") || 0,
                pack_label: el_product.attr("data-product-pack-label") || product.pack_label || "lwh",
                pack_m: el_product.attr("data-product-pack-m") || 0
            },
            el_product.data("def-pack-obj", defpackobj)),
            el_product.attr("data-product-pack-x", edition.pack_x).attr("data-product-pack-y", edition.pack_y).attr("data-product-pack-z", edition.pack_z).attr("data-product-pack-label", defpackobj.pack_label);
            var dimmension = "";
            dimmension += edition.pack_x + "x" + edition.pack_y + "x" + edition.pack_z,
            el_product.find(".js-store-prod-dimensions").html(t_store_dict("product-" + defpackobj.pack_label) + ": " + dimmension + "&nbsp;" + t_store_dict("mm"))
        } else if (defpackobj && defpackobj.pack_x) {
            el_product.attr("data-product-pack-x", defpackobj.pack_x).attr("data-product-pack-y", defpackobj.pack_y).attr("data-product-pack-z", defpackobj.pack_z).attr("data-product-pack-label", defpackobj.pack_label);
            var dimmension = "";
            dimmension += defpackobj.pack_x + "x" + defpackobj.pack_y + "x" + defpackobj.pack_z,
            el_product.find(".js-store-prod-dimensions").html(t_store_dict("product-" + defpackobj.pack_label) + ": " + dimmension + "&nbsp;" + t_store_dict("mm"))
        }
        edition.pack_m ? (el_product.attr("data-product-pack-m", edition.pack_m),
        el_product.find(".js-store-prod-weight").html(t_store_dict("product-weight") + ": " + edition.pack_m + "&nbsp;" + t_store_dict("g"))) : defpackobj && parseFloat(defpackobj.pack_m) > 0 && (el_product.attr("data-product-pack-m", defpackobj.pack_m),
        el_product.find(".js-store-prod-weight").html(t_store_dict("product-weight") + ": " + defpackobj.pack_m + "&nbsp;" + t_store_dict("g")))
    } catch (e) {
        console.log(e)
    }
    if (edition.img)
        el_product.attr("data-product-img", edition.img),
        "large" === el_product.data("cardSize") ? t_store_product_updateEdition_moveSlider(recid, el_product, edition) : isChanged && t_store_get_productCard_img_replaceWith(product, el_product, opts, edition.img);
    else {
        var prevEditionImgUrl = el_product.attr("data-product-img");
        void 0 !== prevEditionImgUrl && "" !== prevEditionImgUrl && "large" === el_product.data("cardSize") && (t_store_product_updateEdition_moveSlider(recid, el_product, edition),
        el_product.attr("data-product-img", ""))
    }
    product.portion > 0 ? (el_product.attr("data-product-unit", product.unit),
    el_product.attr("data-product-portion", product.portion),
    el_product.attr("data-product-single", product.single)) : (el_product.removeAttr("data-product-unit"),
    el_product.removeAttr("data-product-portion"),
    el_product.removeAttr("data-product-single"))
}
function t_store_product_updateEdition_moveSlider(recid, el_product, edition) {
    if (0 === el_product.find(".t-slds").length)
        return el_product.on("sliderIsReady", (function() {
            t_store_product_updateEdition_moveSlider(recid, el_product, edition)
        }
        )),
        void el_product.off("sliderIsReady");
    var pos = 1;
    -1 !== edition.img.indexOf("&amp;") && (edition.img = edition.img.replace("&amp;", "&"));
    var sliderWrapper = el_product.find(".t-slds__items-wrapper")
      , el_editionImg = el_product.find('.t-slds__item .t-slds__bgimg[data-original="' + edition.img + '"]')
      , el_editionImgFreeOrTrial = el_product.find('.t-slds__item .t-slds__bgimg[data-original="' + (edition.img || "").replace("static.tildacdn.com", "static.tildacdn.info") + '"]');
    0 === el_editionImg.length && el_editionImgFreeOrTrial.length > 0 && (el_editionImg = el_editionImgFreeOrTrial),
    edition.img && (pos = $(el_editionImg[0]).parents(".t-slds__item").attr("data-slide-index"),
    0 === parseInt(pos, 10) && (pos = sliderWrapper.attr("data-slider-totalslides"))),
    sliderWrapper.attr("data-slider-pos", pos),
    t_store_onFuncLoad("t_slideMoveInstantly", (function() {
        t_slideMoveInstantly(recid + " .js-store-product")
    }
    )),
    $("#rec" + recid + " .js-store-product").on("sliderIsReady", (function() {
        t_slideMoveInstantly(recid + " .js-store-product"),
        $(this).off("sliderIsReady")
    }
    ))
}
function t_store_product_triggerSoldOutMsg(el_product, isSoldOut, opts) {
    el_product.find(".js-store-prod-sold-out").remove();
    var el_buyBtn = el_product.find('[href="#order"]'), soldOutMsg;
    if ("large" === el_product.data("cardSize")) {
        var el_buyBtnTxt = el_buyBtn.find(".js-store-prod-popup-buy-btn-txt");
        if (0 === el_buyBtnTxt.length && (el_buyBtnTxt = el_buyBtn.find(".js-store-prod-buy-btn-txt")),
        isSoldOut)
            soldOutMsg = t_store_get_soldOutMsg_html(),
            el_product.find(".js-store-price-wrapper").append(soldOutMsg),
            el_buyBtn.addClass("t-store__prod-popup__btn_disabled"),
            el_buyBtnTxt.text(t_store_dict("soldOut"));
        else {
            el_buyBtn.removeClass("t-store__prod-popup__btn_disabled");
            var btnTitle = opts.buyBtnTitle || opts.popup_opts && opts.popup_opts.btnTitle || t_store_dict("addtocart");
            el_buyBtnTxt.text(btnTitle)
        }
    } else
        "small" === el_product.data("cardSize") && (isSoldOut ? (soldOutMsg = t_store_get_soldOutMsg_html(),
        el_product.find(".js-store-price-wrapper").append(soldOutMsg),
        el_buyBtn.length > 1 ? el_buyBtn.not(":first").hide() : el_buyBtn.hide()) : (el_buyBtn.show(),
        el_buyBtn.css("display", "")))
}
function t_store_product_addOneOptionsControl(type, curOption, optionsWrapper, options, firstAvailabeEdition, recid) {
    if (curOption.name) {
        var str, tplOneOptionTag, tplSelect, optionsTags = "", isCustomOption;
        if ("modificator" === type) {
            if (void 0 === curOption.values)
                return;
            tplOneOptionTag = '<option value="[[value]]" data-product-variant-price="[[price]]">[[text]]</option>';
            var valuesArr = curOption.values.split("\n");
            $.each(valuesArr, (function(key, value) {
                var valueText = value.split("=")[0]
                  , valuePrice = value.split("=")[1];
                optionsTags += tplOneOptionTag.replace(/\[\[value\]\]/g, t_store_escapeQuote(valueText).replace(/&amp;/g, "&amp;amp;")).replace(/\[\[text\]\]/g, t_store_escapeQuote(valueText)).replace(/\[\[price\]\]/g, valuePrice || "")
            }
            )),
            str = (tplSelect = t_store_get_control_option_html(options)).replace(/\[\[name\]\]/g, curOption.name).replace(/\[\[optiontags\]\]/g, optionsTags)
        } else
            tplOneOptionTag = '<option value="[[value]]">[[text]]</option>',
            $.each(curOption.values, (function(key, value) {
                "" !== value && (optionsTags += tplOneOptionTag.replace(/\[\[value\]\]/g, t_store_escapeQuote(value).replace(/&amp;/g, "&amp;amp;")).replace(/\[\[text\]\]/g, t_store_escapeQuote(value)))
            }
            )),
            "" !== optionsTags && (str = (tplSelect = t_store_get_control_editionOption_html(options, curOption)).replace(/\[\[id\]\]/g, curOption.id.replace(/&amp;/g, "&amp;amp;")).replace(/\[\[name\]\]/g, curOption.name).replace(/\[\[optiontags\]\]/g, optionsTags));
        if (optionsWrapper.append(str),
        t_store_option_checkIfCustom(curOption) && t_store_option_styleCustomControl(recid, options, curOption, optionsWrapper, firstAvailabeEdition),
        "editionopt" === type)
            return optionsWrapper.find(".js-product-edition-option").last()
    }
}
function t_store_product_getEditionOptionsArr(product, optionsData) {
    var editions = product.editions
      , defaultProps = ["quantity", "price", "priceold", "gallery", "sku", "uid", "img", "externalid", "pack_x", "pack_y", "pack_z", "pack_m"]
      , allProps = Object.keys(editions[0])
      , editionOptions = [];
    return allProps.forEach((function(p) {
        if (-1 === defaultProps.indexOf(p)) {
            var propEl = {
                name: p,
                id: t_store_combineOptionIdByName(p),
                params: t_store_product_getEditionOptionsArr_getParams(p, product, optionsData),
                values: t_store_product_getEditionOptionsArr_getValues(p, editions),
                imagesObj: t_store_product_getEditionOptionsArr_getImgValues(p, editions),
                valuesObj: optionsData && optionsData[p] ? optionsData[p].values : {}
            };
            editionOptions.push(propEl)
        }
    }
    )),
    editionOptions
}
function t_store_product_getFirstAvailableEditionData(editions) {
    for (var i = 0; i < editions.length; i++) {
        var curEdition = editions[i];
        if (0 !== parseInt(curEdition.quantity, 10))
            return curEdition
    }
    return editions[0]
}
function t_store_product_getFirstAvailableEditionData_forCertainVals(editions, optsValsBeforeChangedArr, el_product, curVal) {
    for (var firstAvailable = "", i = 0; i < editions.length; i++) {
        for (var curEdition = editions[i], doesContainSelectedOpts = !0, j = 0; j < optsValsBeforeChangedArr.length; j++) {
            var name = optsValsBeforeChangedArr[j].name, id, val = t_store_product_getCurEditionOptValById(el_product, optsValsBeforeChangedArr[j].id);
            if (void 0 !== curVal && j === optsValsBeforeChangedArr.length - 1 && (val = curVal),
            curEdition[name] !== val) {
                doesContainSelectedOpts = !1;
                break
            }
        }
        if (doesContainSelectedOpts) {
            if (0 !== parseInt(curEdition.quantity, 10))
                return curEdition;
            firstAvailable || (firstAvailable = curEdition)
        }
    }
    return firstAvailable
}
function t_store_product_getEditionOptionsArr_getValues(prop, editions) {
    var values = [];
    return editions.forEach((function(curEdition) {
        var val = curEdition[prop];
        -1 === values.indexOf(val) && values.push(val)
    }
    )),
    values = t_store_product_sortValues(values)
}
function t_store_product_sortValues(values, type, filterValues) {
    var result = values || [];
    if (!values.length)
        return result;
    var testValue = "filter" === type ? values[0].value.toString() : values[0].toString(), clothesOrder = ["XXXS", "3XS", "XXS", "2XS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "XXXXL", "BXL", "4XL", "BXXL", "5XL", "BXXXL", "6XL"], wattOrder, bytesOrder, weightOrder, lengthOrder, litreOrder, units = {
        wattOrder: ["Вт", "W", "даВт", "daW", "гВт", "hW", "кВт", "kW", "мВт", "mW", "ГВт", "GW", "ТВт", "TW", "ПВт", "PW"],
        bytesOrder: ["Б", "B", "Кб", "Кбайт", "KiB", "KB", "Мбайт", "Мб", "MiB", "MB", "Mb", "Гбайт", "Гб", "GiB", "GB", "Gb", "Тбайт", "Тб", "TiB", "TB"],
        weightOrder: ["мкг", "mcg", "мг", "mg", "г", "g", "кг", "kg", "т", "t", "ц"],
        lengthOrder: ["мкм", "мм", "mm", "дм", "dm", "см", "cm", "м", "m", "км", "km"],
        litreOrder: ["мл", "л"]
    }, isCloth = !0, checkValues;
    if ((filterValues || values).forEach((function(value) {
        "string" == typeof value && (value = value.trim().toUpperCase(),
        clothesOrder.indexOf(value) < 0 && (isCloth = !1))
    }
    )),
    isCloth)
        result = result.sort((function(a, b) {
            var valueA = "filter" === type ? a.value : a
              , valueB = "filter" === type ? b.value : b;
            return clothesOrder.indexOf(valueA) - clothesOrder.indexOf(valueB)
        }
        ));
    else {
        try {
            result = values.sort((function(a, b) {
                var valueA = "filter" === type ? a.value : a
                  , valueB = "filter" === type ? b.value : b;
                return valueA = parseFloat(valueA.toString().replace(",", ".").trim()),
                valueB = parseFloat(valueB.toString().replace(",", ".").trim()),
                isNaN(valueA) || isNaN(valueB) ? 0 : valueA - valueB
            }
            ))
        } catch (e) {
            console.log(e)
        }
        try {
            for (var unit in units) {
                var values, isUnit = t_store_product_testUnits(values = units[unit], testValue), re = new RegExp(/^\d*,?\.?\d+\s*/,"gi");
                if (isUnit)
                    return result = result.sort((function(a, b) {
                        var valueA = "filter" === type ? a.value : a
                          , valueB = "filter" === type ? b.value : b;
                        return valueA = valueA.toString().replace(re, "").trim(),
                        valueB = valueB.toString().replace(re, "").trim(),
                        values.indexOf(valueA) - values.indexOf(valueB)
                    }
                    ))
            }
        } catch (e) {
            console.log(e)
        }
    }
    return result
}
function t_store_product_testUnits(values, testValue) {
    var result = !1;
    testValue = testValue.replace(/\s/g, "");
    for (var i = 0; i < values.length; i++) {
        var value = values[i], test, re;
        if (new RegExp("^[\\d.,]+(" + value + "){1}$","i").test(testValue)) {
            result = !0;
            break
        }
    }
    return result
}
function t_store_product_getEditionOptionsArr_getParams(p, product, optionsData) {
    var params = {};
    if (optionsData)
        params = optionsData[p] ? optionsData[p].params : {};
    else {
        var json_options = JSON.parse(product.json_options);
        json_options && json_options.forEach((function(optionObj) {
            optionObj.params && optionObj.title && optionObj.title === p && (params = optionObj.params)
        }
        ))
    }
    return params
}
function t_store_product_getEditionOptionsArr_getImgValues(prop, editions) {
    var values = {};
    return editions.forEach((function(curEdition) {
        var val = curEdition[prop];
        values[val] || (values[val] = curEdition.img)
    }
    )),
    values
}
function t_store_product_getCurEditionOptValById(el_product, id) {
    var el_optionsWrap;
    return el_product.find('.js-product-edition-option[data-edition-option-id="' + id + '"]').find(".js-product-edition-option-variants").val() || ""
}
function t_store_product_getEditionSelectEl(wrapper, curOption) {
    return wrapper.find('.js-product-edition-option[data-edition-option-id="' + curOption.id + '"]')
}
function t_store_combineOptionIdByName(text) {
    return text.replace(/[/\\'"<>{}]/g, "")
}
function t_store_getProductFirstImg(product) {
    if (product.gallery && "[" === product.gallery[0]) {
        var galleryArr = jQuery.parseJSON(product.gallery);
        if (galleryArr[0] && galleryArr[0].img)
            return galleryArr[0].img
    }
    return ""
}
function t_store__getFormattedPrice(opts, price) {
    if (null == price || 0 == price || "" == price)
        return "";
    t_store_onFuncLoad("t_prod__cleanPrice", (function() {
        price = (price = t_prod__cleanPrice(price)).toString()
    }
    ));
    var showDecPart = !1, hasDefinedSeparator = !1, foo;
    (opts.currencyDecimal ? showDecPart = "00" === opts.currencyDecimal : void 0 !== window.tcart && void 0 !== window.tcart.currency_dec && (showDecPart = "00" === window.tcart.currency_dec),
    opts.currencySeparator ? hasDefinedSeparator = "." === opts.currencySeparator : void 0 !== window.tcart && void 0 !== window.tcart.currency_sep && (hasDefinedSeparator = "." === window.tcart.currency_sep),
    showDecPart) && (-1 === price.indexOf(".") && -1 === price.indexOf(",") ? price += ".00" : 1 === price.substr(price.indexOf(".") + 1).length && (price += "0"));
    return price = (price = hasDefinedSeparator ? price.replace(",", ".") : price.replace(".", ",")).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
function t_store__getFormattedPriceRange(opts, product) {
    if (!Object.prototype.hasOwnProperty.call(opts, "prodCard") || opts.prodCard.showOpts || !opts.price.priceRange || "" == opts.price.priceRange || !Object.prototype.hasOwnProperty.call(product, "minPrice") || !Object.prototype.hasOwnProperty.call(product, "maxPrice"))
        return null;
    var minPrice = product.minPrice
      , maxPrice = product.maxPrice;
    if (null === minPrice || null === maxPrice || minPrice === maxPrice)
        return null;
    minPrice = t_store__getFormattedPrice(opts, minPrice),
    maxPrice = t_store__getFormattedPrice(opts, maxPrice);
    var priceRangeDesign = opts.price.priceRange;
    return opts.currencyTxt && ("l" === opts.currencySide ? minPrice = opts.currencyTxt + minPrice : "r" === opts.currencySide && ("range" === priceRangeDesign ? maxPrice = maxPrice + " " + opts.currencyTxt : "from" === priceRangeDesign && (minPrice = minPrice + " " + opts.currencyTxt))),
    "range" === priceRangeDesign ? minPrice + "&mdash;" + maxPrice : "from" === priceRangeDesign ? t_store_dict("from") + " " + minPrice : void 0
}
function t_store_filters_init(recid, opts, data) {
    if (data.sort || data.search || data.filters && 0 !== data.filters.length) {
        var el_rec = $("#rec" + recid);
        el_rec.find(".js-store-filter").length > 0 || (t_store_filters_drawControls(recid, opts, data),
        t_store_filters_showHideFilterControls(recid, el_rec),
        t_store_filters_handleOnChange(recid, opts))
    }
}
function t_store_filters_showHideFilterControls(recid, el_rec) {
    $(window).on("click", (function(e) {
        var el_title = ""
          , clickedOnTitle = ($(e.target).hasClass("js-store-filter-item-title") || $(e.target).parents("js-store-filter-item-title").length > 0) && $(e.target).parents("#rec" + recid).length > 0
          , clickedInsideWrapper = $(e.target).hasClass("js-store-filter-item-controls-wr") || $(e.target).parents(".js-store-filter-item-controls-wr").length > 0;
        if (!clickedOnTitle)
            return clickedInsideWrapper ? void 0 : void el_rec.find(".js-store-filter-item").removeClass("active");
        var el_item = (el_title = $(e.target)).parents(".js-store-filter-item")
          , el_controlsWrap = el_item.find(".js-store-filter-item-controls-wr");
        el_item.hasClass("active") ? el_item.removeClass("active") : ($(".js-store-filter-item").removeClass("active"),
        el_item.addClass("active"),
        el_controlsWrap.offset().left < 10 ? el_controlsWrap.addClass("t-store__filter__item-controls-wrap_left") : el_controlsWrap.offset().right < 0 && console.log("controlsWrap offset right < 0"))
    }
    ))
}
function t_store_filters_drawControls(recid, opts, data) {
    t_store_filters_cashSortOptsInData(data);
    var str = ""
      , searchSortStr = "";
    searchSortStr += '<div class="t-store__filter__search-and-sort">',
    data.search && (searchSortStr += t_store_filters_drawControls_getSearchHtml()),
    data.sort && (searchSortStr += t_store_filters_drawControls_getSortHtml(data)),
    searchSortStr += "</div>";
    var filterClass = "t-store__filter js-store-filter";
    if (str += '<div class="' + (filterClass += opts.isHorizOnMob ? " t-store__filter_horiz-on-mobile" : "") + '">',
    str += '    <div class="t-store__filter__controls-wrapper">',
    str += "        " + t_store_filters_mobileBtns_getHtml(recid, data),
    str += "        " + t_store_filters_opts_getHtml(recid, data, opts),
    !opts.sidebar || $(window).width() < 960)
        str += searchSortStr;
    else {
        var el_rec, el_sidebarBlock = (el_rec = $("#rec" + recid)).find(".t951__cont-w-filter");
        el_sidebarBlock && el_sidebarBlock.prepend(searchSortStr)
    }
    str += "    </div>";
    var choseBarStr = "";
    choseBarStr += '    <div class="t-store__filter__chosen-bar" style="display: none;">',
    choseBarStr += "    " + t_store_filters_opts_chosenVals_getHtml(),
    choseBarStr += "    " + t_store_filters_prodsNumber_getHtml(),
    choseBarStr += "    </div>",
    opts.sidebar || (str += choseBarStr),
    str += "</div>";
    var el_rec, el_filterWrapper = (el_rec = $("#rec" + recid)).find(".js-store-parts-select-container");
    el_rec.find(".js-store-filter").remove(),
    opts.sidebar ? (el_filterWrapper.append(choseBarStr),
    el_filterWrapper.find(".t951__sidebar-wrapper").append(str)) : el_filterWrapper.append(str),
    el_rec.trigger("controlsDrawn"),
    t_store_filters_opts_checkboxes_groupCheckedToHiddenInput(recid),
    t_store_filters_opts_customSelect_saveToHiddenInput(recid),
    t_store_filters_initUIBtnsOnMobile(el_rec),
    t_store_filters_initResetBtn(recid, opts),
    t_store_filters_initExpandBtn(recid)
}
function t_store_filters_initResetBtn(recid, opts) {
    var el_rec = $("#rec" + recid);
    el_rec.find(".js-store-filter-reset").on("click", (function() {
        el_rec.find(".js-store-filter-search, .js-store-filter-sort, .js-store-filter-opt").val(""),
        el_rec.find(".js-store-parts-switcher.t-active").removeClass("t-active"),
        el_rec.find(".js-store-parts-switcher.t-store__parts-switch-btn-all").addClass("t-active");
        var el_min = el_rec.find(".js-store-filter-pricemin")
          , minPrice = t_store__getFormattedPrice(opts, el_min.attr("data-min-val"));
        el_min.val(minPrice);
        var el_max = el_rec.find(".js-store-filter-pricemax")
          , maxPrice = t_store__getFormattedPrice(opts, el_max.attr("data-max-val"));
        el_max.val(maxPrice),
        el_rec.find(".js-store-filter-onlyavail, .js-store-filter-opt-chb").prop("checked", !1),
        el_rec.find(".js-store-filter-custom-select").removeClass("active"),
        el_rec.find(".t-store__filter__checkbox").removeClass("active"),
        el_min.data("previousMin", minPrice),
        el_max.data("previousMax", maxPrice),
        el_rec.find(".t-store__filter__item_select .js-store-filter-opt").data("previousVal", ""),
        el_rec.find(".t-store__filter__chosen-bar").hide();
        var el_min_range = el_rec.find(".t-store__filter__range_min")
          , el_max_range = el_rec.find(".t-store__filter__range_max");
        opts.sidebar && el_min_range.length && el_max_range.length ? t_store_filters_updatePriceRange(el_rec) : t_store_filters_send(recid, opts),
        opts.sidebar && (t_store_filters_opts_sort(opts, recid),
        t_store_filters_scrollStickyBar(el_rec)),
        el_rec.find(".js-store-filter-chosen-item").remove(),
        el_rec.find(".js-store-filter-reset").removeClass("t-store__filter__reset_visible"),
        el_rec.find(".js-store-filter-search-close").hide(),
        t_store_updateUrlWithParams("delete_all", null, null, recid)
    }
    ))
}
function t_store_filters_initExpandBtn(recid) {
    var el_rec;
    $("#rec" + recid).find(".js-store-filter-btn-expand").on("click", (function() {
        var isExpanded = "no" !== $(this).attr("data-expanded")
          , el_filters = $(this).parent().find(".t-store__filter__item-controls-container")
          , button_text = $(this).find(".t-store__filter__btn-text");
        isExpanded ? (el_filters.find(".t-checkbox__control").each((function(i) {
            i > 9 && $(this).addClass("t-checkbox__control_hidden")
        }
        )),
        el_filters.find(".t-store__filter__custom-sel").each((function(i) {
            i > 9 && $(this).addClass("t-store__filter__custom-sel_hidden")
        }
        )),
        button_text.text(t_store_dict("filter-expand")),
        el_filters.removeClass("t-store__filter__item-controls-container_expanded"),
        $(this).attr("data-expanded", "no")) : (el_filters.find(".t-checkbox__control_hidden").removeClass("t-checkbox__control_hidden"),
        el_filters.find(".t-store__filter__custom-sel_hidden").removeClass("t-store__filter__custom-sel_hidden"),
        button_text.text(t_store_dict("filter-collapse")),
        el_filters.addClass("t-store__filter__item-controls-container_expanded"),
        $(this).attr("data-expanded", "yes"))
    }
    ))
}
function t_store_filters_cashSortOptsInData(data) {
    data.sortControlData = {
        name: "sort",
        label: t_store_dict("sort-label"),
        values: [{
            value: "",
            text: t_store_dict("sort-default")
        }, {
            value: "price:asc",
            text: t_store_dict("sort-price-asc")
        }, {
            value: "price:desc",
            text: t_store_dict("sort-price-desc")
        }, {
            value: "title:asc",
            text: t_store_dict("sort-name-asc")
        }, {
            value: "title:desc",
            text: t_store_dict("sort-name-desc")
        }, {
            value: "created:desc",
            text: t_store_dict("sort-created-desc")
        }, {
            value: "created:asc",
            text: t_store_dict("sort-created-asc")
        }]
    }
}
function t_store_filters_drawControls_getSortHtml(data) {
    var str = "";
    str += '<div class="t-store__filter__sort">',
    str += '<div class="t-store__sort-select-wrapper">',
    str += '    <select class="t-store__sort-select t-descr t-descr_xxs js-store-filter-sort" name="sort">';
    for (var i = 0; i < data.sortControlData.values.length; i++) {
        var opt = data.sortControlData.values[i];
        str += '<option data-filter-value="' + opt.value + '" value="' + opt.value + '">' + opt.text + "</option>"
    }
    return str += "    </select>",
    str += "</div>",
    str += "</div>"
}
function t_store_filters_drawControls_getSearchHtml() {
    var str = "";
    return str += '<div class="t-store__filter__search t-descr t-descr_xxs">',
    str += '    <div class="t-store__search-wrapper">',
    str += '        <input class="t-store__filter__input js-store-filter-search" type="text" name="query" placeholder="' + t_store_dict("searchplaceholder") + '">',
    str += '<svg class="t-store__search-icon js-store-filter-search-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"> <path fill="#757575" d="M85 31.1c-.5-8.7-4.4-16.6-10.9-22.3C67.6 3 59.3 0 50.6.6c-8.7.5-16.7 4.4-22.5 11-11.2 12.7-10.7 31.7.6 43.9l-5.3 6.1-2.5-2.2-17.8 20 9 8.1 17.8-20.2-2.1-1.8 5.3-6.1c5.8 4.2 12.6 6.3 19.3 6.3 9 0 18-3.7 24.4-10.9 5.9-6.6 8.8-15 8.2-23.7zM72.4 50.8c-9.7 10.9-26.5 11.9-37.6 2.3-10.9-9.8-11.9-26.6-2.3-37.6 4.7-5.4 11.3-8.5 18.4-8.9h1.6c6.5 0 12.7 2.4 17.6 6.8 5.3 4.7 8.5 11.1 8.9 18.2.5 7-1.9 13.8-6.6 19.2z"></path></svg>',
    str += '<svg class="t-store__search-close-icon js-store-filter-search-close" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#757575" fill-rule="evenodd" clip-rule="evenodd" d="M0.781448 10.6465L10.7814 0.646484L11.4886 1.35359L1.48856 11.3536L0.781448 10.6465Z" fill="black"/><path fill="#757575" fill-rule="evenodd" clip-rule="evenodd" d="M10.6464 11.3536L0.646439 1.35359L1.35355 0.646484L11.3535 10.6465L10.6464 11.3536Z" fill="black"/></svg>',
    str += "    </div>",
    str += "</div>"
}
function t_store_filters_initUIBtnsOnMobile(el_rec) {
    var el_filtBtn = el_rec.find(".js-store-filter-mob-btn")
      , el_filtOpts = el_rec.find(".t-store__filter__options")
      , el_searchBtn = el_rec.find(".js-store-search-mob-btn")
      , el_searchWrap = el_rec.find(".t-store__filter__search-and-sort");
    el_filtBtn.on("click", (function() {
        el_searchWrap.hide(),
        el_searchBtn.removeClass("active"),
        el_filtBtn.hasClass("active") ? (el_filtOpts.hide(),
        el_filtBtn.removeClass("active")) : (el_filtOpts.show(),
        el_filtBtn.addClass("active"))
    }
    )),
    el_searchBtn.on("click", (function() {
        el_filtBtn.removeClass("active"),
        el_searchBtn.hasClass("active") ? (el_searchWrap.hide(),
        el_searchBtn.removeClass("active"),
        el_filtBtn.removeClass("active")) : (el_searchWrap.show(),
        el_searchBtn.addClass("active"),
        el_filtBtn.removeClass("active"))
    }
    ))
}
function t_store_loadMoreBtn_display(recid) {
    var rec = $("#rec" + recid)
      , loadMoreWrap = rec.find(".t-store__load-more-btn-wrap")
      , isMobileOneRow = !!($(window).width() < 960 && rec.find(".js-store-grid-cont.t-store__grid-cont_mobile-one-row")[0]);
    !isMobileOneRow && loadMoreWrap.hasClass("t-store__load-more-btn-wrap_hidden") ? loadMoreWrap.removeClass("t-store__load-more-btn-wrap_hidden") : isMobileOneRow && !loadMoreWrap.hasClass("t-store__load-more-btn-wrap_hidden") && loadMoreWrap.addClass("t-store__load-more-btn-wrap_hidden")
}
function t_store_moveSearhSort(recid, opts) {
    var rec = $("#rec" + recid)
      , searchSort = rec.find(".t-store__filter__search-and-sort");
    if ($(window).width() > 960 && searchSort.is(":hidden") && searchSort.show(),
    opts.sidebar) {
        var controlsWrapper = rec.find(".t-store__filter__controls-wrapper")
          , contWithFiler = rec.find(".js-store-cont-w-filter");
        if (searchSort) {
            var isSearchOnTop = searchSort.parent().hasClass("js-store-cont-w-filter");
            $(window).width() < 960 ? isSearchOnTop && (searchSort.remove(),
            controlsWrapper.append(searchSort)) : isSearchOnTop || (searchSort.remove(),
            contWithFiler.prepend(searchSort))
        }
    }
}
function t_store_filters_send(recid, opts) {
    var filters = {}
      , el_rec = $("#rec" + recid)
      , minVal = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemin").attr("data-min-val"))
      , checkedMinV = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemin").val());
    checkedMinV !== minVal && (filters["price:min"] = checkedMinV);
    var maxVal = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemax").attr("data-max-val"))
      , checkedMaxV = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemax").val());
    checkedMaxV !== maxVal && (filters["price:max"] = checkedMaxV),
    el_rec.find(".js-store-filter-onlyavail")[0] && el_rec.find(".js-store-filter-onlyavail")[0].checked && (filters.quantity = "y");
    var storepartuid = el_rec.find(".t-store__parts-switch-wrapper .js-store-parts-switcher.t-active:not(.t-store__parts-switch-btn-all)").text();
    storepartuid && (filters.storepartuid = storepartuid),
    el_rec.find(".js-store-filter-opt").each((function() {
        var v = $(this).val()
          , name = $(this).attr("name");
        "sort" !== name && (v && "" !== v && "array" === $(this).attr("data-info-type") ? filters[name] = v.split("&&") : v && (filters[name] = v))
    }
    ));
    var searchV = el_rec.find(".js-store-filter-search").val();
    searchV && (filters.query = searchV);
    var sort = {}
      , sortV = el_rec.find(".js-store-filter-sort").val();
    if ("" === sortV && (sortV = el_rec.find('.js-store-filter-opt[name="sort"]').val(),
    t_store_isQueryInAddressBar("tfc_sort[" + recid + "]") && t_store_updateUrlWithParams("delete", "sort", fieldName + ":" + sortDirection, recid)),
    sortV) {
        var fieldName = sortV.split(":")[0]
          , sortDirection = sortV.split(":")[1];
        sort[fieldName] = sortDirection,
        t_store_updateUrlWithParams("update", "sort", fieldName + ":" + sortDirection, recid)
    }
    opts.filters = filters,
    opts.sort = sort,
    t_store_filters_prodsNumber_update(el_rec, opts),
    t_store_showLoadersForProductsList(recid, opts),
    t_store_pagination_updateUrl(recid, opts, 1),
    t_store_loadProducts("", recid, opts)
}
function t_store_filters_mobileBtns_getHtml(recid, data) {
    var str = "";
    return (data.filters.length > 0 || data.sort) && (str += '<div class="js-store-filter-mob-btn t-store__filter__opts-mob-btn t-name t-name_xs">',
    str += '<svg class="t-store__filter__opts-mob-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.42 100"><defs><style>.cls-1{fill:#1d1d1b;}</style></defs><title>2Монтажная область 1 копия</title><path class="cls-1" d="M13.75,22.59V.38h-6V22.59a10.75,10.75,0,0,0,0,20.64V99.62h6V43.23a10.75,10.75,0,0,0,0-20.64Z"/><path class="cls-1" d="M63.42,67.09a10.75,10.75,0,0,0-7.75-10.32V.38h-6V56.77a10.75,10.75,0,0,0,0,20.64V99.62h6V77.41A10.75,10.75,0,0,0,63.42,67.09Z"/></svg>',
    str += t_store_dict("filters"),
    str += "</div>"),
    data.search && (str += '<div class="js-store-search-mob-btn t-store__filter__search-mob-btn t-descr t-descr_xs">',
    str += '<svg class="t-store__filter__search-mob-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"> <path fill="#3f3f3f" d="M85 31.1c-.5-8.7-4.4-16.6-10.9-22.3C67.6 3 59.3 0 50.6.6c-8.7.5-16.7 4.4-22.5 11-11.2 12.7-10.7 31.7.6 43.9l-5.3 6.1-2.5-2.2-17.8 20 9 8.1 17.8-20.2-2.1-1.8 5.3-6.1c5.8 4.2 12.6 6.3 19.3 6.3 9 0 18-3.7 24.4-10.9 5.9-6.6 8.8-15 8.2-23.7zM72.4 50.8c-9.7 10.9-26.5 11.9-37.6 2.3-10.9-9.8-11.9-26.6-2.3-37.6 4.7-5.4 11.3-8.5 18.4-8.9h1.6c6.5 0 12.7 2.4 17.6 6.8 5.3 4.7 8.5 11.1 8.9 18.2.5 7-1.9 13.8-6.6 19.2z"></path></svg>',
    str += "</div>"),
    str
}
function t_store_filters_opts_getHtml(recid, data, opts) {
    var str = "";
    if (0 === data.filters.length && !data.sort)
        return "";
    str += '<div class="t-store__filter__options ' + (data.sort || data.search ? "" : "t-store__filter__options_center") + '">';
    var filtersArr = data.filters;
    data.sort && (str += t_store_filters_opts_getHtml_customSelect(data.sortControlData, opts));
    for (var i = 0; i < filtersArr.length; i++) {
        var f = filtersArr[i];
        "select" === f.control ? str += t_store_filters_opts_getHtml_customSelect(f, opts) : "checkbox" === f.control ? str += t_store_filters_opts_getHtml_checkbox(f, opts) : "range" === f.control && "price" === f.name && (str += t_store_filters_opts_getHtml_range(f, opts))
    }
    return str += "</div>"
}
function t_store_filters_opts_getOption(f) {
    var optionsData = t_store_option_getOptionsData();
    if (!optionsData)
        return null;
    var curOption = f.type && "option" === f.type ? optionsData[f.label] : null, isCustomOption;
    return curOption && t_store_option_checkIfCustom(curOption) ? curOption : null
}
function t_store_filters_opts_getHtml_customSelect(f, opts) {
    var str = ""
      , curOption = t_store_filters_opts_getOption(f);
    if (curOption && curOption.params && curOption.params.hasColor)
        return t_store_filters_opts_getHtml_checkbox(f, opts);
    var isColor, parentMod = "", itemsListMod = "";
    curOption && (parentMod = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__item"),
    itemsListMod = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__item-controls-container"),
    isColor = curOption.params && curOption.params.hasColor);
    var sortClass = "sort" === f.name ? "t-store__filter__item_sort-mobile" : "", customClass;
    str += '<div class="' + sortClass + " t-store__filter__item" + (curOption ? " t-store__filter__item_custom " : " ") + parentMod + ' t-store__filter__item_select js-store-filter-item t-descr t-descr_xxs">',
    str += '    <div class="t-store__filter__item-title js-store-filter-item-title" data-filter-name="' + f.name.toLowerCase() + '">' + f.label + "</div>",
    str += '    <div class="t-store__filter__item-controls-wrap js-store-filter-item-controls-wr">',
    str += '        <div class="t-store__filter__item-controls-container ' + itemsListMod + '" data-type="selectbox">',
    str += '        <input type="hidden" class="js-store-filter-opt" name="' + f.name + '">';
    var isExpandable = !1;
    if (f.values) {
        f.values = t_store_product_sortValues(f.values, "filter"),
        isExpandable = opts.sidebar && f.values.length > 10;
        for (var j = 0; j < f.values.length; j++) {
            var v = f.values[j].value
              , text = f.values[j].text
              , className = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__custom-sel");
            if (className = opts.sidebar && j > 9 ? className += " t-store__filter__custom-sel_hidden " : className += "",
            "" !== v) {
                var tmp = "", titleMod;
                if (tmp = '<div class="t-store__filter__custom-sel ' + className + " js-store-filter-custom-select " + sortClass + '" data-select-val="" data-filter-value="" type="selectbox">',
                isColor) {
                    var checkmarkStyle = curOption ? ' style="background-color: ' + t_store_option_getColorValue(curOption.values, v) + ';"' : "", checkmarkMod;
                    tmp += '<div class="t-store__filter__checkmark ' + t_store_option_getClassModificator(curOption, "filter", "t-store__filter__checkmark") + '"' + checkmarkStyle + "></div>"
                }
                tmp += '<div class="t-store__filter__title ' + t_store_option_getClassModificator(curOption, "filter", "t-store__filter__title") + '">' + (text || v) + "</div>",
                tmp += "    </div>";
                var tmpDOM = jQuery.parseHTML(tmp);
                $(tmpDOM).attr("data-select-val", v).attr("data-filter-value", v),
                str += $(tmpDOM)[0].outerHTML
            }
        }
    }
    return str += "        </div>",
    isExpandable && (str += t_store_filters_opts_getHtml_expandButton()),
    str += "    </div>",
    str += "</div>"
}
function t_store_filters_opts_getHtml_checkbox(f, opts) {
    var str = "", curOption = t_store_filters_opts_getOption(f), isColor, isImage, parentMod = "", itemsListMod = "";
    curOption && (parentMod = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__item"),
    itemsListMod = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__item-controls-container"),
    isColor = curOption.params && curOption.params.hasColor,
    isImage = curOption.params && curOption.params.linkImage && !curOption.params.hasColor);
    var customClass = curOption ? " t-store__filter__item_custom " : " ";
    if ("quantity" === f.name)
        str += '<div class="t-store__filter__item t-store__filter__item_available js-store-filter-item t-descr t-descr_xxs">',
        str += '<div class="t-store__filter__item-title js-store-filter-item-title" data-filter-name="quantity">',
        str += f.label ? f.label : t_store_dict("filter-available-name"),
        str += "</div>",
        str += '<div class="t-store__filter__item-controls-wrap js-store-filter-item-controls-wr">',
        str += '<label class="t-checkbox__control t-descr t-descr_xxs">',
        str += '<input class="t-checkbox js-store-filter-onlyavail" type="checkbox" name="' + t_store_dict("filter-available-label") + '" data-filter-value="' + t_store_dict("filter-available-label") + '">',
        str += '<div class="t-checkbox__indicator"></div>',
        str += t_store_dict("filter-available-label"),
        str += "</label>",
        str += "</div>",
        str += "</div>";
    else {
        str += '<div class="t-store__filter__item ' + customClass + parentMod + ' t-store__filter__item_checkbox js-store-filter-item t-descr t-descr_xxs">',
        str += '    <div class="t-store__filter__item-title js-store-filter-item-title" data-filter-label="' + f.label.toLowerCase() + '" data-filter-name="' + f.name + '">' + f.label + "</div>",
        str += '    <div class="t-store__filter__item-controls-wrap js-store-filter-item-controls-wr">',
        str += '        <div class="t-store__filter__item-controls-container ' + itemsListMod + '" data-type="checkbox">',
        str += '            <input type="hidden" class="js-store-filter-opt" name="' + f.name + '" data-info-type="array">';
        var isExpandable = !1
          , isCheckmark = isColor || isImage;
        if (f.values) {
            f.values = t_store_product_sortValues(f.values, "filter"),
            isExpandable = opts.sidebar && f.values.length > 10;
            for (var j = 0; j < f.values.length; j++) {
                var v = f.values[j].value
                  , className = t_store_option_getClassModificator(curOption, "filter", "t-store__filter__checkbox");
                className = opts.sidebar && j > 9 ? className += " t-checkbox__control_hidden " : className += "";
                var checkmarkMod = isCheckmark ? "t-store__filter__checkmark " + t_store_option_getClassModificator(curOption, "filter", "t-store__filter__checkmark") : ""
                  , checkmarkStyle = curOption && isColor ? ' style="background-color: ' + t_store_option_getColorValue(curOption.values, v) + ';"' : "";
                if ("" !== v) {
                    var tmp = "", titleMod;
                    tmp = '<label class="t-checkbox__control t-store__filter__checkbox ' + className + ' t-descr t-descr_xxs">',
                    tmp += '<input class="t-checkbox js-store-filter-opt-chb" type="checkbox" name="" data-filter-value="">',
                    tmp += '<div class="t-checkbox__indicator ' + checkmarkMod + '" ' + checkmarkStyle + "></div>",
                    tmp += '<span class="t-store__filter__title ' + t_store_option_getClassModificator(curOption, "filter", "t-store__filter__title") + '">' + v + "</span>",
                    tmp += "</label>";
                    var tmpDOM = jQuery.parseHTML(tmp);
                    $(tmpDOM).find(".js-store-filter-opt-chb").attr("name", v).attr("data-filter-value", v),
                    str += $(tmpDOM)[0].outerHTML
                }
            }
        }
        str += "        </div>",
        isExpandable && (str += t_store_filters_opts_getHtml_expandButton()),
        str += "    </div>",
        str += "</div>"
    }
    return str
}
function t_store_filters_opts_getHtml_range(f, opts) {
    var isSliderAllowed = t_store_filters_priceRange_checkIfAllowed()
      , str = "";
    return str += '<div class="t-store__filter__item t-store__filter__item_price js-store-filter-item t-descr t-descr_xxs">',
    str += '    <div class="t-store__filter__item-title js-store-filter-item-title">',
    str += f.label ? f.label : t_store_dict("filter-price-name"),
    str += "    </div>",
    opts.sidebar && isSliderAllowed && (str += t_store_filters_opts_getHtml_sliderRange(f)),
    str += '    <div class="t-store__filter__item-controls-wrap t-store__filter__item-price-box js-store-filter-item-controls-wr">',
    str += '        <input class="t-store__filter__input js-store-filter-pricemin" type="text" name="price:min" data-min-val="' + f.min + '" value="' + t_store__getFormattedPrice(opts, f.min) + '">',
    str += '&nbsp;—&nbsp;<input class="t-store__filter__input js-store-filter-pricemax" type="text" name="price:max" data-max-val="' + f.max + '" value="' + t_store__getFormattedPrice(opts, f.max) + '">',
    str += '<button class="t-store__filter__btn js-store-filter-price-btn">OK</button>',
    str += "    </div>",
    str += "</div>"
}
function t_store_filters_opts_getHtml_sliderRange(f) {
    var str = "";
    str += '<div class="t-store__filter__item-controls-wrap t-store__filter__item-price-slider js-store-filter-item-controls-wr">',
    str += '<div class="t-store__filter__price-outer t-store__filter__price-outer_start"></div>',
    str += '<div class="t-store__filter__price-outer t-store__filter__price-outer_end"></div>';
    var decimals = t_store_filters_price_countDecimals([f.min, f.max])
      , step = "";
    return step = 1 === decimals ? .1 : decimals >= 2 ? .01 : 1,
    str += '<input class="t-store__filter__range t-store__filter__range_min" type="range" name="price_range" min="' + t_prod__cleanPrice(f.min) + '" max="' + t_prod__cleanPrice(f.max) + '" step="' + step + '" data-min-val="' + t_prod__cleanPrice(f.min) + '" value="' + t_prod__cleanPrice(t_prod__cleanPrice(f.min)) + '">',
    str += '<input class="t-store__filter__range t-store__filter__range_max" type="range" name="price_range" min="' + t_prod__cleanPrice(f.min) + '" max="' + t_prod__cleanPrice(f.max) + '" step="' + step + '" data-max-val="' + t_prod__cleanPrice(f.max) + '" value="' + t_prod__cleanPrice(f.max) + '">',
    str += '<div class="t-store__filter__range_bg"></div>',
    str += "</div>"
}
function t_store_filters_opts_checkboxes_groupCheckedToHiddenInput(recid) {
    var el_rec;
    $("#rec" + recid).find(".js-store-filter-opt-chb").on("change", (function() {
        t_store_filters_opts_checkboxes_changeHiddenInput($(this))
    }
    ))
}
function t_store_filters_opts_checkboxes_changeHiddenInput(el_changedCheckbox, fromSwitch) {
    var el_hiddenInput = el_changedCheckbox.parents(".js-store-filter-item").find(".js-store-filter-opt")
      , value = el_hiddenInput.val();
    if (el_changedCheckbox[0].checked)
        fromSwitch ? value = el_changedCheckbox.attr("name") : "" === value ? value = el_changedCheckbox.attr("name") : value += "&&" + el_changedCheckbox.attr("name");
    else {
        var arr = value.split("&&")
          , index = arr.indexOf(el_changedCheckbox.attr("name"));
        -1 !== index && arr.splice(index, 1),
        value = arr.join("&&")
    }
    el_hiddenInput.val(value)
}
function t_store_filters_opts_getHtml_expandButton() {
    var str = "";
    return str += '<button class="t-store__filter__btn-expand js-store-filter-btn-expand" data-expanded="no" type="button">',
    str += '<span class="t-store__filter__btn-text t-descr t-descr_xxs">' + t_store_dict("filter-expand") + "</span>",
    str += "</button>"
}
function t_store_filters_opts_customSelect_saveToHiddenInput(recid) {
    var el_rec;
    $("#rec" + recid).find(".js-store-filter-custom-select").on("click", (function() {
        var el_hiddenInput = $(this).parents(".js-store-filter-item").find(".js-store-filter-opt")
          , el_filterItem = $(this).parents(".js-store-filter-item");
        if ($(this).hasClass("active"))
            return $(this).removeClass("active"),
            void el_hiddenInput.val("");
        var val = $(this).attr("data-select-val");
        el_hiddenInput.val(val),
        el_filterItem.find(".js-store-filter-custom-select").removeClass("active"),
        $(this).addClass("active")
    }
    ))
}
function t_store_filters_opts_customSelect_changeHiddenInput(element) {
    var el_hiddenInput = element.parents(".js-store-filter-item").find(".js-store-filter-opt")
      , elementValue = element.attr("data-select-val");
    el_hiddenInput.val(elementValue),
    el_hiddenInput.data("previousVal", elementValue)
}
function t_store_filters_opts_chosenVals_getHtml() {
    var str = "";
    return str += '<div class="t-store__filter__chosen-wrapper js-store-opts-chosen-wrapper">',
    str += '<div class="t-store__filter__reset js-store-filter-reset t-descr t-descr_xxs">' + t_store_dict("filter-reset") + "</div>",
    str += "</div>"
}
function t_store_filters_prodsNumber_getHtml() {
    var str = "";
    return str += '<div class="t-store__filter__prods-number js-store-filters-prodsnumber-wrap t-descr t-descr_xxs" style="display:none;">',
    str += t_store_dict("filter-prodsnumber"),
    str += ': <span class="js-store-filters-prodsnumber">',
    str += "</span>",
    str += "</div>"
}
function t_store_filters_prodsNumber_update(rec, opts, obj) {
    if (opts.filters) {
        var chosenBar = rec.find(".t-store__filter__chosen-bar"), changedFiltersNumber, chosenValues;
        if (Object.keys(opts.filters).length && opts.previewmode.length ? chosenBar.show() : chosenBar.hide(),
        Object.keys(opts.filters).length > 0 && obj && obj.products.length > 0 && opts.isPublishedPage)
            return chosenBar.show(),
            rec.find(".js-store-filters-prodsnumber").text(obj.total),
            void rec.find(".js-store-filters-prodsnumber-wrap").show();
        if (rec.find(".js-store-filters-prodsnumber-wrap").hide(),
        opts.sidebar)
            chosenBar.find(".t-store__filter__chosen-val").length || chosenBar.hide()
    }
}
function t_store_filters_opts_chosenVal_add(recid, val, el_control, label) {
    var option = el_control.closest(".t-store__filter__item-controls-container").find(".js-store-filter-opt").attr("name"), isExist;
    if (!!!$("#rec" + recid).find('.t-store__filter__chosen-val[data-option-name="' + option + '"][data-field-val="' + val + '"]')[0]) {
        var tmp = '<div class="t-store__filter__chosen-val js-store-filter-chosen-item t-descr t-descr_xxs" data-field-val=""></div>'
          , tmpDOM = jQuery.parseHTML(tmp);
        $(tmpDOM).attr("data-field-val", val).text(t_store_unescapeHtml(label || val)),
        option && $(tmpDOM).attr("data-option-name", option);
        var str = $(tmpDOM)[0].outerHTML, el_wrapper = $("#rec" + recid).find(".js-store-opts-chosen-wrapper"), el_chosenTagItem;
        el_wrapper.prepend(str),
        (option ? el_wrapper.find('.js-store-filter-chosen-item[data-field-val="' + val + '"][data-option-name="' + option + '"]') : el_wrapper.find('.js-store-filter-chosen-item[data-field-val="' + val + '"]')).data("controlElem", el_control),
        el_wrapper.find(".js-store-filter-chosen-item").length > 1 && el_wrapper.find(".js-store-filter-reset").addClass("t-store__filter__reset_visible")
    }
}
function t_store_filters_handleOnChange(recid, opts) {
    var el_rec = $("#rec" + recid);
    t_store_filters_handleOnChange_avail(recid, opts, el_rec),
    t_store_filters_handleOnChange_price(recid, opts, el_rec),
    opts.sidebar && t_store_filters_handleOnChange_priceRange(recid, opts, el_rec),
    t_store_filters_handleOnChange_checkbox(recid, opts, el_rec),
    t_store_filters_handleOnChange_selectbox(recid, opts, el_rec),
    t_store_filters_handleOnChange_sort(recid, opts, el_rec),
    t_store_filters_handleOnChange_search(recid, opts, el_rec),
    t_store_filters_opts_checkedValues_hideOnClick(recid, opts)
}
function t_store_filters_handleOnChange_avail(recid, opts, el_rec) {
    el_rec.find(".js-store-filter-onlyavail").on("change", (function() {
        var controlValue = $(this).attr("name"), onlyAvailableControl;
        $(this).hasClass("js-store-filter-onlyavail") && (controlValue = "y");
        var controlGroup = $(this).closest(".t-store__filter__item-controls-wrap").siblings(".js-store-filter-item-title")
          , controlGroupdId = $(controlGroup).data("filter-name");
        $(this)[0].checked ? (t_store_updateUrlWithParams("add", controlGroupdId, controlValue, recid),
        t_store_filters_opts_chosenVal_add(recid, controlValue, $(this), t_store_dict("filter-available-label"))) : (t_store_updateUrlWithParams("delete", controlGroupdId, controlValue, recid),
        t_store_filters_opts_chosenVal_hide(el_rec, controlValue)),
        t_store_filters_send(recid, opts)
    }
    ))
}
function t_store_filters_handleOnChange_price(recid, opts, el_rec) {
    var el_priceFiltItem = el_rec.find(".js-store-filter-item.t-store__filter__item_price"), minVal = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemin").attr("data-min-val")), maxVal = t_prod__cleanPrice(el_rec.find(".js-store-filter-pricemax").attr("data-max-val")), el_min = el_rec.find(".js-store-filter-pricemin"), el_max = el_rec.find(".js-store-filter-pricemax"), el_btn;
    el_min.data("previousMin") || el_min.data("previousMin", minVal),
    opts.sidebar && (el_min.on("change", (function() {
        var minPriceChanged, el_min_range;
        t_store_filters_handleOnChange_price_checkMin(recid, el_min, minVal, maxVal, opts) && (t_store_filters_send(recid, opts),
        el_rec.find(".t-store__filter__range_min").trigger("input"))
    }
    )),
    el_max.on("change", (function() {
        var maxPriceChanged, el_max_range;
        t_store_filters_handleOnChange_price_checkMax(recid, el_max, minVal, maxVal, opts) && (t_store_filters_send(recid, opts),
        el_rec.find(".t-store__filter__range_max").trigger("input"))
    }
    ))),
    el_min.on("keypress tstoreMinPriceTriggerReset", (function(e) {
        if ("keypress" !== e.type || 13 === e.which) {
            var minPriceChanged = !1
              , maxPriceChanged = !1
              , isChanged = !1;
            minPriceChanged = t_store_filters_handleOnChange_price_checkMin(recid, el_min, minVal, maxVal, opts),
            maxPriceChanged = t_store_filters_handleOnChange_price_checkMax(recid, el_max, minVal, maxVal, opts),
            (isChanged = minPriceChanged || maxPriceChanged) && (t_store_filters_send(recid, opts),
            el_min.blur(),
            window.isMobile || el_priceFiltItem.removeClass("active"))
        }
    }
    )),
    el_max.data("previousMax") || el_max.data("previousMax", maxVal),
    el_max.on("keypress tstoreMaxPriceTriggerReset", (function(e) {
        if ("keypress" !== e.type || 13 === e.which) {
            var minPriceChanged = !1
              , maxPriceChanged = !1
              , isChanged = !1;
            minPriceChanged = t_store_filters_handleOnChange_price_checkMin(recid, el_min, minVal, maxVal, opts),
            maxPriceChanged = t_store_filters_handleOnChange_price_checkMax(recid, el_max, minVal, maxVal, opts),
            (isChanged = minPriceChanged || maxPriceChanged) && (t_store_filters_send(recid, opts),
            el_max.blur(),
            window.isMobile || el_priceFiltItem.removeClass("active"))
        }
    }
    )),
    el_rec.find(".js-store-filter-price-btn").on("click", (function() {
        var minPriceChanged = !1
          , maxPriceChanged = !1
          , isChanged = !1;
        minPriceChanged = t_store_filters_handleOnChange_price_checkMin(recid, el_min, minVal, maxVal, opts),
        maxPriceChanged = t_store_filters_handleOnChange_price_checkMax(recid, el_max, minVal, maxVal, opts),
        (isChanged = minPriceChanged || maxPriceChanged) && (t_store_filters_send(recid, opts),
        window.isMobile || el_priceFiltItem.removeClass("active"))
    }
    ))
}
function t_store_filters_handleOnChange_priceRange(recid, opts, el_rec) {
    var isSliderAllowed = t_store_filters_priceRange_checkIfAllowed();
    if (opts.sidebar && isSliderAllowed) {
        var el_min_range = el_rec.find(".t-store__filter__range_min")
          , el_max_range = el_rec.find(".t-store__filter__range_max")
          , el_min_text = el_rec.find(".js-store-filter-pricemin")
          , el_max_text = el_rec.find(".js-store-filter-pricemax")
          , min = +el_min_text.attr("data-min-val")
          , max = +el_max_text.attr("data-max-val")
          , minRangeVal = t_prod__cleanPrice(el_min_range.val())
          , maxRangeVal = t_prod__cleanPrice(el_max_range.val());
        t_store_filters_calcPriceOuterWidth(el_rec, "start", min, max, minRangeVal),
        t_store_filters_calcPriceOuterWidth(el_rec, "end", min, max, maxRangeVal);
        var minTimer = null
          , maxTimer = null;
        el_min_range.on("input", (function() {
            var resultVal = t_prod__cleanPrice(el_min_range.val())
              , minVal = t_prod__cleanPrice(el_min_range.val())
              , maxVal = t_prod__cleanPrice(el_max_range.val());
            min === max ? resultVal = max : minVal > maxVal ? resultVal = maxVal - 1 : minVal < min ? resultVal = min : minVal >= max && (resultVal = max - 1),
            el_min_range.val(resultVal);
            var formattedPrice = resultVal ? t_store__getFormattedPrice(opts, resultVal.toString()) : resultVal;
            el_min_text.val(formattedPrice),
            t_store_filters_calcPriceOuterWidth(el_rec, "start", min, max, resultVal),
            minTimer && clearTimeout(minTimer),
            minTimer = setTimeout((function() {
                el_min_text.trigger("tstoreMinPriceTriggerReset"),
                t_store_filters_scrollStickyBar(el_rec)
            }
            ), 1e3)
        }
        )),
        el_max_range.on("input", (function() {
            var resultVal = t_prod__cleanPrice(el_max_range.val())
              , minVal = t_prod__cleanPrice(el_min_range.val())
              , maxVal = t_prod__cleanPrice(el_max_range.val());
            min === max ? resultVal = max : maxVal < minVal ? resultVal = minVal + 1 : maxVal <= min ? resultVal = min + 1 : maxVal > max && (resultVal = max),
            el_max_range.val(resultVal);
            var formattedPrice = resultVal ? t_store__getFormattedPrice(opts, resultVal.toString()) : resultVal;
            el_max_text.val(formattedPrice),
            t_store_filters_calcPriceOuterWidth(el_rec, "end", min, max, resultVal),
            maxTimer && clearTimeout(maxTimer),
            maxTimer = setTimeout((function() {
                el_max_text.trigger("tstoreMaxPriceTriggerReset"),
                t_store_filters_scrollStickyBar(el_rec)
            }
            ), 1e3)
        }
        ))
    }
}
function t_store_filters_handleOnChange_price_checkMax(recid, el_max, minVal, maxVal, opts) {
    var el_rec = $("#rec" + recid)
      , val = t_prod__cleanPrice(el_max.val());
    if (val !== el_max.data("previousMax")) {
        var slider_el;
        if (val = t_store_filters_handleOnChange_checkInRange(val, el_max, minVal, maxVal, "max"),
        opts && opts.sidebar)
            el_rec.find(".t-store__filter__range_max").val(val);
        var text = "< " + el_max.val();
        return el_max.data("previousMax") && t_store_filters_opts_chosenVal_hide(el_rec, el_max.data("previousMax")),
        val !== maxVal && t_store_filters_opts_chosenVal_add(recid, val, el_max, text),
        el_max.data("previousMax", val),
        val !== maxVal ? (el_max.attr("data-filter-value", val),
        t_store_updateUrlWithParams("update", "price:max", val, recid)) : val <= maxVal && (el_max.attr("data-filter-value", ""),
        t_store_updateUrlWithParams("delete", "price:max", val, recid)),
        !0
    }
    return !1
}
function t_store_filters_handleOnChange_price_checkMin(recid, el_min, minVal, maxVal, opts) {
    var el_rec = $("#rec" + recid)
      , val = t_prod__cleanPrice(el_min.val());
    if (val !== el_min.data("previousMin")) {
        var slider_el;
        if (val = t_store_filters_handleOnChange_checkInRange(val, el_min, minVal, maxVal, "min"),
        opts && opts.sidebar)
            el_rec.find(".t-store__filter__range_min").val(val);
        var text = "> " + el_min.val();
        return el_min.data("previousMin") && t_store_filters_opts_chosenVal_hide(el_rec, el_min.data("previousMin")),
        val !== minVal && t_store_filters_opts_chosenVal_add(recid, val, el_min, text),
        el_min.data("previousMin", val),
        val !== minVal ? (el_min.attr("data-filter-value", val),
        t_store_updateUrlWithParams("update", "price:min", val, recid)) : val >= minVal && (el_min.attr("data-filter-value", ""),
        t_store_updateUrlWithParams("delete", "price:min", val, recid)),
        !0
    }
    return !1
}
function t_store_filters_handleOnChange_checkInRange(val, el_input, minVal, maxVal, type) {
    return 0 === val && "max" === type ? (val = maxVal,
    el_input.val(maxVal)) : val > maxVal ? (val = maxVal,
    el_input.val(maxVal)) : val < minVal && (val = minVal,
    el_input.val(minVal)),
    val
}
function t_store_filters_handleOnChange_checkbox(recid, opts, el_rec) {
    el_rec.find(".js-store-filter-opt-chb").on("change", (function() {
        var controlValue = $(this).attr("name")
          , controlGroup = $(this).closest(".t-store__filter__item-controls-wrap").siblings(".js-store-filter-item-title")
          , controlGroupdId = $(controlGroup).data("filter-name");
        $(this)[0].checked ? ($(this).parent().addClass("active"),
        t_store_updateUrlWithParams("add", controlGroupdId, controlValue, recid),
        t_store_filters_opts_chosenVal_add(recid, controlValue, $(this))) : ($(this).parent().removeClass("active"),
        t_store_updateUrlWithParams("delete", controlGroupdId, controlValue, recid),
        t_store_filters_opts_chosenVal_hide(el_rec, controlValue, $(this))),
        t_store_setActiveStorePart(recid),
        t_store_filters_send(recid, opts),
        opts.sidebar && (t_store_filters_opts_sort(opts, recid),
        t_store_filters_scrollStickyBar(el_rec))
    }
    ))
}
function t_store_filters_handleOnChange_selectbox(recid, opts, el_rec) {
    el_rec.find(".js-store-filter-custom-select").on("click", (function(e) {
        var isMobileSort = $(e.target).hasClass("t-store__filter__item_sort-mobile") || $(this).hasClass("t-store__filter__item_sort-mobile")
          , text = $(this).attr("data-select-val")
          , label = $(this).text()
          , controlGroup = $(this).closest(".t-store__filter__item-controls-wrap").siblings(".js-store-filter-item-title")
          , controlGroupdId = $(controlGroup).data("filter-name")
          , el_hiddenInput = $(this).parents(".js-store-filter-item").find(".js-store-filter-opt")
          , previous = el_hiddenInput.data("previousVal");
        if (previous && t_store_filters_opts_chosenVal_hide(el_rec, previous),
        previous === text)
            return t_store_updateUrlWithParams("delete", controlGroupdId, text, recid),
            t_store_setActiveStorePart(recid),
            t_store_filters_send(recid, opts),
            el_hiddenInput.data("previousVal", ""),
            void (opts.sidebar && t_store_filters_opts_sort(opts, recid));
        isMobileSort && el_rec.find(".js-store-filter-sort").val(text),
        t_store_updateUrlWithParams("update", controlGroupdId, text, recid),
        isMobileSort || t_store_filters_opts_chosenVal_add(recid, text, $(this), label),
        t_store_filters_send(recid, opts),
        el_hiddenInput.data("previousVal", text),
        opts.sidebar && (t_store_filters_opts_sort(opts, recid),
        t_store_filters_scrollStickyBar(el_rec))
    }
    ))
}
function t_store_filters_handleOnChange_search(recid, opts, el_rec) {
    var rec = $("#rec" + recid), prevQuery = "", el_input = el_rec.find(".js-store-filter-search"), el_closeBtn = el_rec.find(".js-store-filter-search-close"), el_searchBtn;
    el_rec.find(".js-store-filter-search-btn").on("click", (function() {
        prevQuery !== el_input.val() && (t_store_filters_opts_chosenVal_hide(el_rec, prevQuery),
        prevQuery = el_input.val(),
        t_store_filters_handleOnChange_search_send(recid, el_input, el_closeBtn, opts))
    }
    )),
    el_input.on("keypress tstoreSearchTriggerReset", (function(e, value) {
        value && "" === prevQuery ? prevQuery = value : e.currentTarget.defaultValue && "" === prevQuery && (prevQuery = e.currentTarget.defaultValue,
        e.currentTarget.defaultValue = ""),
        "keypress" === e.type && 13 !== e.which || prevQuery !== el_input.val() && (t_store_filters_opts_chosenVal_hide(el_rec, prevQuery),
        prevQuery = el_input.val(),
        t_store_filters_handleOnChange_search_send(recid, el_input, el_closeBtn, opts))
    }
    )).on("keyup", (function() {
        $(this).val().length > 0 ? el_closeBtn.show() : 0 === $(this).val().length && el_closeBtn.hide()
    }
    )),
    el_closeBtn.on("click", (function() {
        rec.find('.js-store-filter-search[name="query"]').attr("value") && (prevQuery = rec.find('.js-store-filter-search[name="query"]').attr("value")),
        t_store_filters_opts_chosenVal_hide(el_rec, prevQuery),
        el_input.val(""),
        prevQuery = "",
        rec.find('.js-store-filter-search[name="query"]')[0].defaultValue = "",
        t_store_filters_handleOnChange_search_send(recid, el_input, el_closeBtn, opts)
    }
    ))
}
function t_store_filters_handleOnChange_search_send(recid, el_input, el_closeBtn, opts) {
    var val = el_input.val();
    if ("" !== val) {
        var chosenValText = t_store_dict("searchplaceholder") + ": " + val;
        t_store_updateUrlWithParams("update", "query", val, recid),
        t_store_filters_opts_chosenVal_add(recid, val, el_input, chosenValText)
    } else
        el_closeBtn.hide(),
        t_store_updateUrlWithParams("delete", "query", val, recid);
    t_store_filters_send(recid, opts),
    el_input.blur()
}
function t_store_filters_handleOnChange_sort(recid, opts, el_rec) {
    el_rec.find(".js-store-filter-sort").on("change", (function(e) {
        $(this).find('[selected="selected"]').attr("selected", !1),
        $(e.currentTarget.selectedOptions[0]).attr("selected", !0),
        t_store_filters_send(recid, opts)
    }
    ))
}
function t_store_filters_calcPriceOuterWidth(el_rec, endpoint, min, max, value) {
    var distance = max - min
      , isStart = "start" === endpoint
      , result = isStart ? Math.ceil((value - min) / distance * 100) : Math.ceil((max - value) / distance * 100);
    isStart ? el_rec.find(".t-store__filter__price-outer_start").css("width", result + "%") : el_rec.find(".t-store__filter__price-outer_end").css("width", result + "%")
}
function t_store_filters_updatePriceRange(el_rec) {
    var isSliderAllowed;
    if (t_store_filters_priceRange_checkIfAllowed()) {
        var el_min_range = el_rec.find(".t-store__filter__range_min")
          , el_max_range = el_rec.find(".t-store__filter__range_max")
          , el_min_text = el_rec.find(".js-store-filter-pricemin")
          , el_max_text = el_rec.find(".js-store-filter-pricemax");
        el_min_range.val(t_prod__cleanPrice(el_min_text.val())),
        el_max_range.val(t_prod__cleanPrice(el_max_text.val())),
        el_min_range.trigger("input"),
        el_max_range.trigger("input")
    }
}
function t_store_filters_price_countDecimals(valuesArr) {
    for (var result = 0, i = 0; i < valuesArr.length; i++) {
        var number, numberAsString = (+valuesArr[i]).toString(), decimals = 0;
        -1 !== numberAsString.indexOf(".") && (decimals = numberAsString.split(".")[1].length),
        decimals > result && (result = decimals)
    }
    return result
}
function t_store_filters_opts_chosenVal_hide(el_rec, value, el_control) {
    var option = el_control && el_control.length ? el_control.closest(".t-store__filter__item-controls-container").find(".js-store-filter-opt").attr("name") : null;
    "number" == typeof value && (value = value.toString());
    var el_chosen = option ? el_rec.find('.js-store-filter-chosen-item[data-field-val="' + value + '"][data-option-name="' + option + '"]') : el_rec.find('.js-store-filter-chosen-item[data-field-val="' + value.replace(/\\/g, "\\\\") + '"]'), isSidebar, el_min_range;
    "951" === el_rec.attr("data-record-type") && t_store_filters_updatePriceRange(el_rec),
    el_rec.find(".t-store__filter__range_min").trigger("input"),
    el_chosen.remove(),
    el_rec.find(".js-store-filter-chosen-item").length <= 1 && el_rec.find(".js-store-filter-reset").removeClass("t-store__filter__reset_visible")
}
function t_store_filters_opts_checkedValues_hideOnClick(recid, opts) {
    var el_rec = $("#rec" + recid), el_filterWrapper, defVal;
    el_rec.find(".js-store-parts-select-container").on("click", ".js-store-filter-chosen-item", (function() {
        var el_chosenItem = $(this)
          , el_control = el_chosenItem.data("controlElem");
        if (!el_control || !el_control.length)
            return el_chosenItem.text() === t_store_dict("filter-available-label") && (t_store_updateUrlWithParams("delete", "quantity", null, recid),
            t_store_filters_opts_chosenVal_hide(el_rec, "y", $(this)),
            t_store_setActiveStorePart(recid),
            t_store_filters_send(recid, opts),
            opts.sidebar && (t_store_filters_opts_sort(opts, recid),
            t_store_filters_scrollStickyBar(el_rec))),
            void console.log("smth wrong with current filter");
        if (el_control.hasClass("js-store-filter-opt-chb") || el_control.hasClass("js-store-filter-onlyavail"))
            el_control[0].checked = !1,
            el_control.trigger("change");
        else if (el_control.hasClass("js-store-filter-custom-select"))
            el_control.trigger("click");
        else if (el_control.hasClass("js-store-filter-pricemin"))
            defVal = t_store__getFormattedPrice(opts, el_control.attr("data-min-val")),
            el_control.val(defVal),
            el_control.trigger("tstoreMinPriceTriggerReset"),
            t_store_updateUrlWithParams("delete", "price:min", null, recid);
        else if (el_control.hasClass("js-store-filter-pricemax"))
            defVal = t_store__getFormattedPrice(opts, el_control.attr("data-max-val")),
            el_control.val(defVal),
            el_control.trigger("tstoreMaxPriceTriggerReset"),
            t_store_updateUrlWithParams("delete", "price:max", null, recid);
        else if (el_control.hasClass("js-store-filter-search")) {
            var el_control_value = el_control.val();
            el_control.val("").trigger("tstoreSearchTriggerReset", el_control_value)
        }
    }
    ))
}
function t_store_filters_scrollStickyBar(el_rec) {
    var el_stickySidebar;
    el_rec.find(".t951__sidebar_sticky").length && $("html, body").animate({
        scrollTop: el_rec.offset().top - 50
    }, 200)
}
function t_store_oneProduct_init(recid, opts) {
    var el_prod = $("#rec" + recid + " .js-store-product_single")
      , uid = el_prod.attr("data-product-gen-uid");
    uid = t_store_oneProduct_clearUid(uid),
    el_prod.attr("data-product-gen-uid", uid),
    t_store_oneProduct_preloader_add(recid);
    var pageMode = $(".t-records").attr("data-tilda-mode");
    opts.isPublishedPage = "edit" !== pageMode && "preview" !== pageMode;
    var requestOnBlockChangeInRedactor = window.tStoreSingleProdsObj && !opts.previewmode;
    !window.tStoreSingleProductsIsRequested || requestOnBlockChangeInRedactor ? (t_store_oneProduct_requestAllSingle(opts),
    window.tStoreSingleProductsIsRequested = !0,
    el_prod.bind("tStoreSingleProductsLoaded", (function() {
        t_store_oneProduct_fill(recid, window.tStoreSingleProdsObj[uid], opts)
    }
    ))) : window.tStoreSingleProdsObj ? t_store_oneProduct_fill(recid, window.tStoreSingleProdsObj[uid], opts) : el_prod.bind("tStoreSingleProductsLoaded", (function() {
        t_store_oneProduct_fill(recid, window.tStoreSingleProdsObj[uid], opts)
    }
    ))
}
function t_store_oneProduct_clearUid(uid) {
    return uid.replace("product id: ", "")
}
function t_store_oneProduct_preloader_add(recid) {
    var el_rec = $("#rec" + recid)
      , el_prod = el_rec.find(".js-store-product_single");
    if (!window.isSearchBot) {
        var elInfo = el_prod.find(".js-store-single-product-info");
        elInfo.hide();
        var preloaderTimerId = setTimeout((function() {
            var str = "";
            str += '<div class="t-store__single-prod-preloader" style="display:none;">';
            for (var strTextEl = '<div class="t-store__single-prod-preloader__text"></div>', i = 0; i < 6; i++)
                str += strTextEl;
            str += "</div>",
            elInfo.before(str),
            el_prod.find(".t-store__single-prod-preloader").fadeIn(200)
        }
        ), 1e3);
        el_rec.data("preloader-timeout", preloaderTimerId)
    }
}
function t_store_oneProduct_preloader_hide(recid) {
    var el_rec = $("#rec" + recid)
      , el_prod = el_rec.find(".js-store-product_single");
    clearTimeout(el_rec.data("preloader-timeout")),
    el_prod.find(".js-store-single-product-info").show(),
    el_prod.find(".t-store__single-prod-preloader").remove()
}
function t_store_oneProduct_requestAllSingle(opts) {
    for (var el_singleProds = $(".js-store-product_single"), arrId = [], i = 0; i < el_singleProds.length; i++) {
        var uid = $(el_singleProds[i]).attr("data-product-gen-uid");
        uid = t_store_oneProduct_clearUid(uid),
        arrId.push(uid)
    }
    t_store_loadProducts_byId(arrId, opts).then((function(data) {
        "string" == typeof data && "{" === data.substr(0, 1) || console.log("Can't get products array by uid list");
        try {
            var dataObj = jQuery.parseJSON(data)
              , productsArr = dataObj.products
        } catch (e) {
            console.log(data)
        }
        "" !== productsArr ? (dataObj.options && dataObj.options.length && !window.tStoreOptionsList && (window.tStoreOptionsList = dataObj.options),
        window.tStoreSingleProdsObj = t_store_oneProduct_prodsArrToAssociative(productsArr),
        el_singleProds.trigger("tStoreSingleProductsLoaded")) : console.log("Something went wrong. Can't get products array by uid list. Please check products UID.")
    }
    ))
}
function t_store_oneProduct_prodsArrToAssociative(productsArr) {
    var obj = {};
    if (!productsArr)
        return obj;
    for (var i = 0; i < productsArr.length; i++) {
        var cur = productsArr[i];
        obj[cur.uid] = cur
    }
    return obj
}
function t_store_oneProduct_fill(recid, data, opts) {
    var el_rec, el_prod = $("#rec" + recid).find(".js-product");
    if (t_store_oneProduct_preloader_hide(recid),
    el_prod.data("cardSize", "large"),
    !data)
        return t_store_oneProduct_error_show(recid, opts),
        t_store_product_triggerSoldOutMsg(el_prod, !0, opts),
        void ("" === el_prod.find(".js-store-prod-price-old-val").text() && el_prod.find(".js-store-prod-price-old").hide());
    t_store_oneProduct_successMsg_show(recid, data, opts),
    t_store_oneProduct_fill_data(recid, data, el_prod, opts),
    t_store_option_handleOnChange_custom(recid, el_prod, opts)
}
function t_store_oneProduct_successMsg_show(recid, data, opts) {
    if (!opts.previewmode) {
        var el_rec = $("#rec" + recid)
          , text = "RU" === window.tildaBrowserLang ? "Товар успешно связан с каталогом. Название товара в каталоге: " : "Product is connected to catalog. Product name in catalog is ";
        t_store_showMsgInRedactor(el_rec, text += "<b>" + data.title + "</b>", "success")
    }
}
function t_store_oneProduct_error_show(recid, opts) {
    var el_rec, errorText;
    opts.previewmode || t_store_showMsgInRedactor($("#rec" + recid), "RU" === window.tildaBrowserLang ? "Не удается получить товар из каталога. Возможно он был удален или отключен. Пожалуйста, проверьте, что товар с таким ID существует." : "Can't find a product in the catalog. It may have been deleted or disabled. Please check that the product with this ID exists.", "error")
}
function t_store_showMsgInRedactor(el_rec, text, type) {
    el_rec.find(".js-store-msg").remove();
    var textColor, bgColor = "success" === type ? "#62C584" : "yellow", msgHtml = "";
    msgHtml += '<div class="js-store-msg" style="margin: 0px;text-align: left; font-family: tfutura,Arial; color: ' + ("success" === type ? "#fff" : "#000") + ';">',
    msgHtml += '   <div style="background: ' + bgColor + '; padding: 16px 20px; box-sizing: border-box; margin-bottom: 30px; position: relative;" class="t-container">',
    msgHtml += '       <div style="width: 40px; height: 40px; position: absolute; left: 20px; bottom: -40px;">',
    msgHtml += '       <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="40px" width="40px"><polygon fill="' + bgColor + '" stroke="' + bgColor + '" stroke-width="0" points="0,0 40,0 0,20 0,0"></polygon></svg>',
    msgHtml += "       </div>",
    msgHtml += text,
    msgHtml += "   </div>",
    msgHtml += "</div>",
    el_rec.prepend(msgHtml)
}
function t_store_oneProduct_fill_data(recid, data, el_product, opts) {
    t_store_addProductOptions(recid, data, el_product, opts, "largecard"),
    t_store_onFuncLoad("t_prod__init", (function() {
        t_prod__init(recid)
    }
    ))
}
function t_store_isQueryInAddressBar(queryString) {
    var currentLocationSearch;
    return -1 !== decodeURI(window.location.href).indexOf(queryString)
}
function t_store_getColumnWidth(size) {
    var windowWidth, mediaQuery, gridSizes;
    return {
        minWidth1200: {
            col_1: 60,
            col_2: 160,
            col_3: 260,
            col_4: 360,
            col_5: 460,
            col_6: 560,
            col_7: 660,
            col_8: 760,
            col_9: 860,
            col_10: 960,
            col_11: 1060,
            col_12: 1160
        },
        maxWidth1200: {
            col_1: 60,
            col_2: 140,
            col_3: 220,
            col_4: 300,
            col_5: 380,
            col_6: 460,
            col_7: 540,
            col_8: 620,
            col_9: 700,
            col_10: 780,
            col_11: 860,
            col_12: 940
        }
    }[(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) > 1200 ? "minWidth1200" : "maxWidth1200"]["col_" + size]
}
function t_store_paramsToObj(recid, opts) {
    var paramsString;
    try {
        paramsString = decodeURI(window.location.search)
    } catch (e) {
        paramsString = window.location.search
    }
    var result = {
        otherParams: []
    };
    result[recid] = {};
    try {
        paramsString = paramsString.replace(/&amp;/g, "%26amp")
    } catch (e) {
        console.log(e)
    }
    var params = paramsString.slice(1).split("&"), recIdFromURL;
    (params = params.map((function(param) {
        return param.replace(/%26amp/g, "&amp;")
    }
    )),
    result.otherParams = params.filter((function(param) {
        var isTildaFilter;
        return !(/^tfc_/i.test(param) || /^s_/i.test(param)) && param
    }
    )),
    -1 !== window.location.href.indexOf("s_recid=")) ? window.location.href.split("s_recid=")[1].split("&")[0] == recid && params.splice(1).forEach((function(param) {
        try {
            var isTildaFilter = /^s_/i.test(param), isRecOnPage;
            if (!$("#rec" + recid).length)
                return;
            if (result[recid] || (result[recid] = {}),
            isTildaFilter) {
                var parts = (param = (param = param.replace(/^s_/i, "tfc_")).replace(/%3A/gi, ":")).split("=")
                  , key = parts[0]
                  , values = parts[1].replace(/\+/g, " ").split("%2B")
                  , filter = key.replace(/^tfc_/i, "");
                result[recid][filter] = result[recid][filter] ? result[recid][filter].concat(values) : values
            }
        } catch (e) {
            console.log(e)
        }
    }
    )) : -1 !== window.location.href.indexOf("tfc_") && params.forEach((function(param) {
        var parts = param.split("=");
        try {
            var isTildaFilter;
            if (/^tfc_/i.test(param)) {
                var key = parts[0], values = parts[1].replace(/\+/g, " ").split("%2B"), regexp = new RegExp(/\[\d.*\]$/,"gi"), match = key.match(regexp), recid = match ? Number(JSON.parse(match[0])) : null, isRecOnPage;
                if (!recid)
                    return void console.error("Can't find recid in URL param");
                if (!$("#rec" + recid).length)
                    return;
                var filter = key.replace(regexp, "").replace("tfc_", "");
                result[recid] || (result[recid] = {}),
                result[recid][filter] = result[recid][filter] ? result[recid][filter].concat(values) : values
            }
        } catch (e) {
            console.log(e)
        }
    }
    ));
    window.tStoreCustomUrlParams = result,
    t_store_paramsToObj_updateUrl(result);
    var sortByRec = t_store_paramsToObj_getDefaultSort(recid, opts.defaultSort);
    for (var rec in sortByRec) {
        var newSort = sortByRec[rec].sort
          , newQuantity = sortByRec[rec].quantity;
        (newSort || newQuantity) && (result[rec] && result[rec].sort && opts.previewmode || newSort && (result[rec] || (result[rec] = {}),
        result[rec].sort = newSort),
        result[rec] && "y" === result[rec].quantity && opts.previewmode || newQuantity && (result[rec] || (result[rec] = {}),
        result[rec].quantity = "y"))
    }
    return window.tStoreCustomUrlParams = result,
    result
}
function t_store_paramsToObj_updateUrl(paramsObj) {
    var newUrl = t_store_customURLParamsToString(paramsObj);
    window.location.hash && (newUrl += window.location.hash);
    try {
        window.history.replaceState(null, null, newUrl)
    } catch (e) {}
}
function t_store_paramsToObj_getDefaultSort(recid, sort) {
    var result = window.tStoreDefaultSort ? window.tStoreDefaultSort : {};
    if (!sort)
        return result;
    if (sort.default) {
        var mapSort = {
            "sort-price-asc": "price:asc",
            "sort-price-desc": "price:desc",
            "sort-name-asc": "title:asc",
            "sort-name-desc": "title:desc",
            "sort-created-asc": "created:asc",
            "sort-created-desc": "created:desc"
        };
        result[recid] || (result[recid] = {}),
        result[recid].sort = new Array(mapSort[sort.default])
    }
    return sort.in_stock && (result[recid] || (result[recid] = {}),
    result[recid].quantity = "y"),
    window.tStoreDefaultSort = result,
    result
}
function t_store_customURLParamsToString(params) {
    var result = ""
      , otherParams = "";
    for (var param in params) {
        var rec = params[param];
        if ("otherParams" !== param)
            for (var filter in rec)
                try {
                    var values = Array.isArray(rec[filter]) ? rec[filter].join("[[PLUS]]") : rec[filter].toString();
                    values = (values = (values = (values = values.replace(/%/g, "%25")).replace(/\[\[PLUS\]\]/g, "%2B")).replace(/%26amp/g, "&amp;")).replace(/\s/gi, "+"),
                    result += result.length ? "&" : "?",
                    result += "tfc_" + filter + "[" + param + "]=" + values
                } catch (e) {
                    console.log(e)
                }
    }
    return params.otherParams && params.otherParams.length && (params.otherParams.forEach((function(param) {
        param.length && (otherParams += "&" + param)
    }
    )),
    result = result.length ? result + otherParams : "?" + otherParams.slice(1)),
    result.length ? result : window.location.origin + window.location.pathname
}
function t_store_updateUrlWithParams(method, key, value, recid) {
    try {
        var params = window.tStoreCustomUrlParams || {};
        switch (params[recid] || (params[recid] = {}),
        method) {
        case "add":
            params[recid][key] ? params[recid][key].push(value) : params[recid][key] = [value];
            break;
        case "update":
            params[recid][key] = [value];
            break;
        case "delete":
            if (!params[recid][key])
                break;
            var deleteThis;
            "string" == typeof params[recid][key] || "query" === key || "sort" === key || "price:min" === key || "price:max" === key || "quantity" === key ? delete params[recid][key] : params[recid][key] = params[recid][key].filter((function(item) {
                return item !== value
            }
            )),
            params[recid][key] && !params[recid][key].length && (params[recid][key] = null,
            delete params[recid][key]);
            break;
        case "delete_all":
            delete params[recid]
        }
        window.tStoreCustomUrlParams = params,
        t_store_paramsToObj_updateUrl(params)
    } catch (e) {
        console.log("something wrong in t_store_updateUrlWithParams", e)
    }
}
function t_store_updateOptionsBasedOnUrl(opts, customUrlParams, recid) {
    try {
        var params = customUrlParams[recid];
        for (var key in opts.filters = {},
        params)
            if ("sort" !== key) {
                var isString = -1 !== key.indexOf("price:m") || -1 !== key.indexOf("quantity");
                opts.filters[key] = isString ? params[key].toString() : params[key]
            } else {
                opts.sort = {};
                var parts = params[key].join().split(":")
                  , key = parts[0]
                  , value = parts[1];
                opts.sort[key] = value
            }
        return opts
    } catch (e) {
        console.log("something wrong in t_store_updateOptionsBasedOnUrl", e)
    }
}
function t_store_filters_opts_sort(opts, recid) {
    var el_rec, el_container;
    opts.sidebar && $("#rec" + recid).find(".t-store__filter__item-controls-container").each((function() {
        var type = $(this).attr("data-type");
        if ("checkbox" === type) {
            var el_controls = $(this).find(".t-checkbox__control"), filterValues = [], sorted;
            el_controls.each((function(i, control) {
                var value = $(control).find(".js-store-filter-opt-chb").attr("data-filter-value");
                filterValues.push(value)
            }
            )),
            (sorted = el_controls.sort((function(a, b) {
                var first = $(a).find(".js-store-filter-opt-chb")
                  , second = $(b).find(".js-store-filter-opt-chb");
                if (first.is(":checked") && !second.is(":checked"))
                    return -1;
                if (!first.is(":checked") && second.is(":checked"))
                    return 1;
                if (!first.is(":checked") && !second.is(":checked")) {
                    var valueA = first.attr("data-filter-value")
                      , valueB = second.attr("data-filter-value")
                      , sorted = [valueA, valueB].sort();
                    return (sorted = t_store_product_sortValues(sorted, "string", filterValues)).indexOf(valueA) - sorted.indexOf(valueB)
                }
                return 0
            }
            ))).each((function() {
                var control;
                $(this).find(".js-store-filter-opt-chb").is(":checked") && $(this).removeClass("t-checkbox__control_hidden")
            }
            )),
            $(this).append(sorted)
        } else if ("selectbox" === type) {
            var el_controls = $(this).find(".t-store__filter__custom-sel"), filterValues = [], sorted;
            el_controls.each((function() {
                var value = $(this).attr("data-filter-value");
                filterValues.push(value)
            }
            )),
            (sorted = el_controls.sort((function(a, b) {
                if ($(a).hasClass("active") && $(b).hasClass("active"))
                    return 1;
                if ($(a).hasClass("active") && !$(b).hasClass("active"))
                    return -1;
                if (!$(a).hasClass("active") && !$(b).hasClass("active")) {
                    var valueA = $(a).attr("data-filter-value")
                      , valueB = $(b).attr("data-filter-value")
                      , sorted = [valueA, valueB].sort();
                    return (sorted = t_store_product_sortValues(sorted, "string", filterValues)).indexOf(valueA) - sorted.indexOf(valueB)
                }
                return 0
            }
            ))).each((function() {
                $(this).hasClass("active") && $(this).removeClass("t-store__filter__custom-sel_hidden")
            }
            )),
            $(this).append(sorted)
        }
    }
    ))
}
function t_store_filters_render_selected(opts, recid) {
    try {
        var rec = $("#rec" + recid), filterObject = Object.assign({}, opts.filters), sortObject = Object.assign({}, opts.sort), controlType, el_control;
        for (var filterKey in filterObject)
            "string" == typeof filterObject[filterKey] && (filterObject[filterKey] = [filterObject[filterKey]]),
            filterObject[filterKey].forEach((function(filterValue) {
                var filterLabel;
                if (el_control = rec.find('[data-filter-value="' + filterValue.replace(/\\/g, "\\\\") + '"]'),
                "price:min" === filterKey)
                    (el_control = rec.find('[name="price:min"]')).data("previousMin", parseInt(filterValue, 10)),
                    el_control.attr("value", t_store__getFormattedPrice(opts, filterValue)),
                    t_store_filters_opts_chosenVal_add(recid, filterValue, el_control, filterLabel = "> " + filterValue),
                    opts.sidebar && rec.find(".t-store__filter__range_min").val(filterValue);
                else if ("price:max" === filterKey)
                    (el_control = rec.find('[name="price:max"]')).data("previousMax", parseInt(filterValue, 10)),
                    el_control.attr("value", t_store__getFormattedPrice(opts, filterValue)),
                    t_store_filters_opts_chosenVal_add(recid, filterValue, el_control, filterLabel = "< " + filterValue),
                    opts.sidebar && rec.find(".t-store__filter__range_max").val(filterValue);
                else if ("query" === filterKey)
                    rec.find(".js-store-filter-search-close").show(),
                    (el_control = rec.find('[name="query"]')).attr("value", filterValue),
                    el_control.val(filterValue),
                    filterLabel = t_store_dict("searchplaceholder") + ": " + filterValue,
                    t_store_filters_opts_chosenVal_add(recid, filterValue, el_control, filterLabel);
                else if ("quantity" === filterKey)
                    (el_control = rec.find(".js-store-filter-onlyavail")).length && el_control.prop("checked", !0),
                    filterLabel = t_store_dict("filter-available-label"),
                    t_store_filters_opts_chosenVal_add(recid, filterValue, el_control, filterLabel);
                else if (el_control.length > 0)
                    switch (controlType = el_control.attr("type")) {
                    case "checkbox":
                        el_control.each((function() {
                            var option = $(this).closest(".t-store__filter__item-controls-container").find(".js-store-filter-opt").attr("name"), isValid;
                            filterObject[option] && -1 !== filterObject[option].indexOf(filterValue) && ($(this).prop("checked", !0),
                            $(this).parent().addClass("active"),
                            t_store_filters_opts_chosenVal_add(recid, filterValue, $(this)),
                            t_store_filters_opts_checkboxes_changeHiddenInput($(this)))
                        }
                        ));
                        break;
                    case "selectbox":
                        el_control.each((function() {
                            var option = $(this).closest(".t-store__filter__item-controls-container").find(".js-store-filter-opt").attr("name"), isValid;
                            filterObject[option] && -1 !== filterObject[option].indexOf(filterValue) && (t_store_filters_opts_chosenVal_add(recid, filterValue, $(this)),
                            $(this).addClass("active"),
                            t_store_filters_opts_customSelect_changeHiddenInput($(this)))
                        }
                        ))
                    }
            }
            ));
        for (var sortKey in sortObject) {
            var sortQuery = sortKey + ":" + sortObject[sortKey]
              , el_control_option = rec.find('option[data-filter-value="' + sortQuery + '"]')
              , el_control_select = rec.find('.js-store-filter-custom-select[data-filter-value="' + sortQuery + '"]');
            el_control_option.attr("selected", "selected"),
            el_control_select.addClass("active")
        }
    } catch (e) {
        console.log("something wrong in t_store_filters_render_selected", e)
    }
}
function t_store_option_getOptionsData() {
    var productsOptions = window.tStoreOptionsList;
    if (!productsOptions)
        return null;
    for (var result = {}, i = 0; i < productsOptions.length; i++) {
        var option = productsOptions[i]
          , key = option.title;
        option.params && "string" == typeof option.params && (option.params = JSON.parse(option.params)),
        option.values && "string" == typeof option.values && (option.values = JSON.parse(option.values)),
        result[key] = option
    }
    return result
}
function t_store_option_checkIfCustom(curOption) {
    var params = curOption.params;
    return !(!params || Array.isArray(params)) && (!(!params.view || "select" === params.view) || !(!params.hasColor && !params.linkImage))
}
function t_store_tabs_handleOnChange(recid, el_product) {
    var tabs = el_product.find(".t-store__tabs"), design, isAccordion = "accordion" === tabs.attr("data-tab-design"), buttons = el_product.find(".js-store-tab-button");
    if (buttons.off("click"),
    buttons.on("click", (function() {
        var title = $(this).attr("data-tab-title")
          , el_list = tabs.find(".t-store__tabs__list");
        if (isAccordion) {
            var el_tab = $(this).parent();
            el_tab.find(".t-store__tabs__content").slideToggle(300),
            el_tab.find(".t-store__tabs__item-button").toggleClass("t-store__tabs__item-button_active"),
            el_tab.toggleClass("t-store__tabs__item_active"),
            el_list.find(".t-store__tabs__item").each((function() {
                var curTitle = $(this).attr("data-tab-title")
                  , el_content = $(this).find(".t-store__tabs__content")
                  , el_button = $(this).find(".t-store__tabs__item-button")
                  , isActive = $(this).hasClass("t-store__tabs__item_active");
                curTitle !== title && isActive && (el_content.slideToggle(300),
                $(this).toggleClass("t-store__tabs__item_active"),
                el_button.toggleClass("t-store__tabs__item-button_active"))
            }
            ))
        } else {
            el_list.find(".t-store__tabs__item").each((function() {
                var curTitle;
                $(this).attr("data-tab-title") === title ? ($(this).addClass("t-store__tabs__item_active"),
                $(this).find(".t-store__tabs__content").css("opacity", 0),
                $(this).find(".t-store__tabs__content").show(),
                setTimeout((function() {
                    t_store_tabs_animateHeight(tabs)
                }
                ), 0)) : ($(this).removeClass("t-store__tabs__item_active"),
                $(this).find(".t-store__tabs__content").hide())
            }
            ));
            var isActive = $(this).hasClass("t-store__tabs__button_active")
              , el_controls = $(this).closest(".t-store__tabs__controls");
            if (isActive || !el_controls.length)
                return;
            el_controls.find(".t-store__tabs__button").each((function() {
                var curTitle;
                $(this).attr("data-tab-title") === title ? $(this).addClass("t-store__tabs__button_active") : $(this).removeClass("t-store__tabs__button_active")
            }
            ))
        }
        tabs.attr("data-active-tab", title)
    }
    )),
    !isAccordion) {
        var el_controls = tabs.find(".t-store__tabs__controls");
        t_store_tabs_handleFade(el_controls),
        el_controls.on("scroll", (function() {
            t_store_tabs_handleFade($(this))
        }
        ))
    }
}
function t_store_tabs_animateHeight(el_container) {
    var heightnow = el_container.height()
      , heightfull = el_container.css({
        height: "auto"
    }).height();
    el_container.find(".t-store__tabs__content").css("opacity", 1),
    el_container.css({
        height: heightnow
    }).animate({
        height: heightfull
    }, 500)
}
function t_store_tabs_handleFade(el_controls) {
    var el_wrapper = el_controls.parent();
    if ($(window).width() < 560) {
        var TRIGGER_DISTANCE = 10
          , width = el_controls.width()
          , scrollLeft = el_controls.scrollLeft()
          , scrollWidth = el_controls[0].scrollWidth;
        scrollLeft > 10 ? el_wrapper.addClass("t-store__tabs__controls-wrap_left") : el_wrapper.removeClass("t-store__tabs__controls-wrap_left"),
        scrollWidth - width > scrollLeft + 10 ? el_wrapper.addClass("t-store__tabs__controls-wrap_right") : el_wrapper.removeClass("t-store__tabs__controls-wrap_right")
    } else
        el_wrapper.removeClass("t-store__tabs__controls-wrap_left"),
        el_wrapper.removeClass("t-store__tabs__controls-wrap_right")
}
function t_store_option_handleOnChange_custom(recid, element, opts) {
    var el_select_custom = element.find(".t-product__option-variants_custom");
    $(".js-product-edition-option-variants").off("change"),
    $(".js-product-edition-option-variants").change((function() {
        var el_control = $(this).closest(".js-product-edition-option")
          , el_custom_ui = el_control.find(".t-product__option-variants_custom");
        if ($("body").trigger("twishlist_addbtn"),
        el_control.length && el_custom_ui.length) {
            var value = $(this).val()
              , el_active_option = el_custom_ui.find(".t-product__option-item_active");
            if (el_active_option.length) {
                var el_input = el_active_option.find(".t-product__option-input");
                if (el_input.val() !== value) {
                    el_input.prop("checked", !1);
                    var el_upd_input = el_custom_ui.find('.t-product__option-input[value="' + value + '"]');
                    setTimeout((function() {
                        el_upd_input.prop("checked", !0).click()
                    }
                    )),
                    el_active_option.removeClass("t-product__option-item_active"),
                    el_upd_input.parent().addClass("t-product__option-item_active"),
                    setTimeout((function() {
                        t_store_unifyCardsHeights(recid, opts),
                        opts.verticalAlignButtons && t_store_verticalAlignButtons(recid, opts)
                    }
                    ), 50)
                }
            }
        }
    }
    )),
    el_select_custom.length && el_select_custom.each((function() {
        var el_input = $(this).find(".t-product__option-input")
          , el_option = $(this).find(".t-product__option-item")
          , el_select_hidden = $(this).parent().find(".t-product__option-variants_regular .js-product-edition-option-variants");
        el_input.off("change"),
        el_input.change((function() {
            var value = $(this).val();
            value = value.replace(/&/g, "&amp;"),
            el_select_hidden.val(value).change(),
            el_option.removeClass("t-product__option-item_active"),
            $(this).parent().addClass("t-product__option-item_active"),
            setTimeout((function() {
                t_store_unifyCardsHeights(recid, opts),
                opts.verticalAlignButtons && t_store_verticalAlignButtons(recid, opts)
            }
            ), 50)
        }
        ))
    }
    ));
    var el_select_selected = element.find(".t-product__option-selected_select");
    if (el_select_selected.length) {
        var el_select_custom = el_select_selected.parent().find(".t-product__option-variants_custom");
        el_select_selected.off("click"),
        el_select_selected.on("click", (function() {
            $(this).next(".t-product__option-variants_custom").toggleClass("t-product__option-variants_hidden"),
            "y" === window.lazy && t_lazyload_update()
        }
        ));
        var el_option = el_select_custom.find(".t-product__option-item");
        el_option.off("click"),
        el_option.on("click", (function() {
            el_option.removeClass("t-product__option-item_active"),
            $(this).addClass("t-product__option-item_active"),
            $(this).closest(".t-product__option-variants_custom").addClass("t-product__option-variants_hidden");
            var value = $(this).find(".t-product__option-title").text(), el_text;
            $(this).closest(".t-product__option").find(".t-product__option-selected-title").text(value);
            var el_selected_color = $(this).closest(".t-product__option").find(".t-product__option-selected.t-product__option-selected_color");
            if (el_selected_color.length) {
                var color = $(this).find(".t-product__option-checkmark_color").css("background-color"), el_checkmark;
                (el_checkmark = el_selected_color.find(".t-product__option-selected-checkmark")).css("background-color", color)
            }
            var el_selected_image = $(this).closest(".t-product__option").find(".t-product__option-selected.t-product__option-selected_image");
            if (el_selected_image.length) {
                var imageUrl = $(this).find(".t-product__option-checkmark_image").css("background-image"), imageUrlLazyload = $(this).find(".t-product__option-checkmark_image").attr("data-original"), el_checkmark;
                (el_checkmark = el_selected_image.find(".t-product__option-selected-checkmark")).attr("data-original", imageUrlLazyload),
                el_checkmark.css("background-image", "none"),
                el_checkmark.css("background-image", imageUrl)
            }
        }
        )),
        $(document).off("click outsideCustomDropdown"),
        $(document).on("click outsideCustomDropdown", (function(e) {
            var el_clicked = $(e.target)
              , el_parent = el_clicked.closest(".t-product__option-variants_custom");
            el_parent.length && $.contains(el_parent[0], el_clicked[0]) || el_clicked.hasClass("t-product__option-selected") || el_clicked.parents(".t-product__option-selected").length || $(".t-product__option-variants_custom.t-product__option-variants_select").addClass("t-product__option-variants_hidden")
        }
        ))
    }
}
function t_store_unescapeHtml(str) {
    return $("<div />").html(str).text()
}
function t_store_filters_priceRange_checkIfAllowed() {
    return !window.isIE
}
function t_store_onFuncLoad(funcName, okFunc, time) {
    if ("function" == typeof window[funcName])
        okFunc();
    else {
        var startTime = Date.now();
        setTimeout((function checkFuncExist() {
            var currentTime = Date.now();
            if ("function" != typeof window[funcName]) {
                if ("complete" === document.readyState && currentTime - startTime > 5e3 && "function" != typeof window[funcName])
                    throw new Error(funcName + " is undefined");
                setTimeout(checkFuncExist, time || 100)
            } else
                okFunc()
        }
        ))
    }
}
function t_store_hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (function(m, r, g, b) {
        return r + r + g + g + b + b
    }
    ));
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      , aaa = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return result ? [aaa.r, aaa.g, aaa.b] : null
}
function t_store_luma_rgb(color) {
    var isArray = Array.isArray(color);
    if (void 0 === color)
        return "black";
    if (0 != color.indexOf("rgb") && !isArray)
        return "black";
    var rgb = isArray ? color : color.split("(")[1].split(")")[0].split(",");
    return rgb.length < 3 ? "black" : .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2] > 128 ? "black" : "white"
}
function t_store_getLightnessColor(color) {
    var rgb, max, min;
    if (-1 === color.indexOf("rgb")) {
        var hex = parseInt(color.indexOf("#") > -1 ? color.substring(1) : color, 16);
        rgb = {
            r: hex >> 16,
            g: (65280 & hex) >> 8,
            b: 255 & hex
        }
    } else {
        var values, rgba = color.replace(/[^\d,.]/g, "").split(",");
        rgb = {
            r: rgba[0],
            g: rgba[1],
            b: rgba[2]
        }
    }
    return rgb.r /= 255,
    rgb.g /= 255,
    rgb.b /= 255,
    (Math.max(rgb.r, rgb.g, rgb.b) + Math.min(rgb.r, rgb.g, rgb.b)) / 2
}
function t_store_removeRgbOpacity(color) {
    if (!color || !color.length)
        return null;
    var result = color.split(",");
    return result[3] && (result[3] = "1)"),
    result.join()
}
function t_store_snippet_getJsonFromUrl() {
    var url, query = window.location.search.substr(1), result = {};
    return query.split("&").forEach((function(part) {
        var item = part.split("=");
        try {
            result[item[0]] = decodeURIComponent(item[1])
        } catch (error) {
            result[item[0]] = item[1]
        }
    }
    )),
    result
}
window.isIE = !!document.documentMode,
window.isIE && "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
    value: function assign(target) {
        "use strict";
        if (null == target)
            throw new TypeError("Cannot convert undefined or null to object");
        for (var to = Object(target), index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (null != nextSource)
                for (var nextKey in nextSource)
                    Object.prototype.hasOwnProperty.call(nextSource, nextKey) && (to[nextKey] = nextSource[nextKey])
        }
        return to
    },
    writable: !0,
    configurable: !0
});
