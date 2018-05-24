$(document).ready(function() {
  var productSlider = new Swiper('.product-slider', {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 10
  });
  var productThumbs = new Swiper('.product-thumbs', {
    spaceBetween: 5,
    centeredSlides: true,
    slidesPerView: 4,
    //touchRatio: 0.2,
    slideToClickedSlide: true,
    direction: 'vertical'
  });
  productSlider.params.control = productThumbs;
  productThumbs.params.control = productSlider;
});