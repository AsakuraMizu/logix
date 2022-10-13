<script lang="ts">
  import { ParseError } from '../parser';

  export let expr = '';
  export let error: Error | undefined;
</script>

{#if error}
  <div class="alert alert-error">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 flex-shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="font-mono">
        {error.toString()}
        {#if expr && error instanceof ParseError}
          <br />
          {expr}
          <br />
          {#each Array.from({ length: expr.length + 1 }).map((_, i) => i) as i}
            {#if i < error.start || i > error.end}
              &nbsp;
            {:else}
              ^
            {/if}
          {/each}
        {/if}
      </span>
    </div>
  </div>
{/if}
