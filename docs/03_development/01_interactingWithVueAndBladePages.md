# <p style="text-align: center;">Interacting with Vue and Blade Pages</p>

##### During development, there are several commands you may find yourself coming back to frequently. Keep this page up-to-date as you run across these common commands.

While not encouraged, there are times where you may look to integrate Vue and Blade in a single file. For example, you may want to use a Vue component on a PHP Blade page. **Best practice is to transfer the PHP blade page to a Vue page**, but if you have backend logic for the blade page that makes this hard, consider using a solution similar to that in the following example.

###### Locations Modal Example

In the past, we were switching the layout for the "Book a Session at one of our Locations" modal on the home page. This was easy enough to do on its own, but we also wanted to use the same modal on the [Locations](https://plunj.co/locations) page, which was a blade page. The Locations page did not require any backend logic, so best practices would say to convert it to a Vue page. Since we figured that this problem might come up in the future, we tried implementing the Vue component in the blade page anyways.

The first step was to create the Vue component. That code should still be present on the site, so you can view that at [resources/js/Components/BookingModal.vue](https://github.com/PlunjDev/plunj-web/blob/main/resources/js/Components/BookingModal.vue). From there, it was easy to implement in a Vue page, which could be done more or less by replacing the old modal code with `<BookingModal :isShowModal="isShowModal" @update:isShowModal="toggleModal"/>` and making sure we had a button to trigger it: `<button type="button" class="button primary-button" @click="toggleModal(true)">Book a Session at One of Our Locations</button>` (and adding a few things at the top, like importing the custom modal, adding a `isShowModal` variable, and adding a `toggleModal()` method). Vue components used in Vue pages, pretty straightforward. Now to implementation within PHP blade pages.

You can add Vue components into blade pages. The logic for this is handled primarily in [resources/js/app.js](https://github.com/PlunjDev/plunj-web/blob/main/resources/js/app.js), which defines Vue logic and can be added to the top of blade pages. Currently, this is handled in [resources/views/layouts/default.blade.php](https://github.com/PlunjDev/plunj-web/blob/main/resources/views/layouts/default.blade.php) with this line that the other blade pages inherit: `@vite(['resources/css/app.css','resources/js/app.js'])`. In the `app.js` file, we use CreateIntertiaApp to define the Vue app and where Vue components can be used. By default, it will look for HTML tags with the `#app` id (which is set for all blade pages in the same `default.blade.php` file to be the `<body>` tag). Quick Google searches will show you that you can just add `.component(YourComponentHere)` to that app and Vue will know what to look for, but it seems that things are a bit more complicated with our setup. Without further delay, here is a side-by-side of how the app is at time of writing, and the changes that would need to be made to get the component to work:

**Original:**

```js
import "./bootstrap";
import "../css/app.css";
import "flowbite";
import "fslightbox";

import { createApp, h } from "vue";
import { createHead } from "@vueuse/head";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue.m";
import Vue3Signature from "vue3-signature";
import Vue3Toasity, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const appName =
  window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";
const head = createHead();

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob("./Pages/**/*.vue")
    ),
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(head)
      .use(ZiggyVue, Ziggy)
      .use(Vue3Signature)
      .use(Vue3Toasity, {
        position: toast.POSITION.BOTTOM_LEFT,
        closeButton: false,
        containerClassName: "toast-container-class",
        toastClassName: "toast-class",
        bodyClassName: "toast-body-class",
        progressClassName: "progress-bar",
        autoClose: 3000,
        transition: toast.TRANSITIONS.BOUNCE, // this doesn't work :(
        style: {
          opacity: "1",
          userSelect: "initial",
        },
      })
      .mount(el);
  },
  progress: {
    color: "#4B5563",
  },
});
```

In the above code, in order to get the component to work, we had to import the `BookingModal`, define `isShowModal` and `toggleModal` (a variable and function that controlled the visibility of the modal on the target page), and create an EventListened to define a new Vue app while exporting our variable and function. You'll also notice that we are now looking for a different tag, `#app-vue`. From here, adding in the modal is actually pretty straightforward and requires only a few lines:

```php
<!-- Bookings Button and Modal -->
<div class="w-11/12 max-w-screen-xl mx-auto text-center" id="app-vue">
    <button type="button" class="button primary-button w-1/3 mx-auto" @click="isShowModal = true">
        Book a Session at One of Our Locations
    </button>

    <!-- Pass isShowModal to Vue Component -->
    <booking-modal :is-show-modal="isShowModal" @update:is-show-modal="isShowModal = !isShowModal"></booking-modal>
</div>
```

Granted, there may be an easier way to do this, but this was the best solution we could find at the time.

---

Other helpful guides:

- [Integrating Vue.js Components in Laravel: A Beginner’s Guide](https://f24aalam.medium.com/integrating-vue-js-components-in-laravel-a-beginners-guide-cf8414a27d6b)
