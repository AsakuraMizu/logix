<script lang="ts">
  import { active, Route, router } from 'tinro';
  import About from './routes/About.svelte';
  import Table from './routes/table/Table.svelte';

  router.mode.hash();
</script>

<div class="drawer-mobile drawer">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <Route path="/" redirect="/about">About</Route>
    <Route path="/about"><About /></Route>
    <Route path="/table"><Table /></Route>
    <label for="drawer" class="btn btn-circle drawer-button fixed right-0 bottom-0 m-10 lg:hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block h-6 w-6 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </label>
  </div>
  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay" />
    <ul class="menu w-80 overflow-y-auto bg-base-200 p-4 text-base-content">
      <li><a href="/about" use:active>About</a></li>
      <li>
        <a href="/table" use:active>Truth Table</a>
      </li>
    </ul>
  </div>
</div>
