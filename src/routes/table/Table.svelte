<script lang="ts">
  import ErrorInfo from '../../components/ErrorInfo.svelte';
  import process from './process';

  let exprs = [''];
  let mode: '01' | 'ft' | 'FT' = '01';
  const display = (value: boolean) => {
    switch (mode) {
      case '01':
        return +value;
      case 'ft':
        return value;
      case 'FT':
        return value ? 'T' : 'F';
    }
  };

  let variables: string[] = [],
    results: boolean[][] = [],
    errors: (Error | undefined)[] = [];
  $: ({ variables, results, errors } = process(exprs));
</script>

<div class="w-full space-y-3 p-5">
  <h1 class="text-4xl font-bold">Truth Table</h1>
  {#each exprs as expr, i}
    <div class="flex w-full flex-col gap-2">
      <div class="flex items-center">
        {#if i === exprs.length - 1}
          <button
            class="btn btn-ghost btn-circle btn-sm text-lg"
            on:click={() => (exprs = [...exprs, ''])}
          >
            +
          </button>
        {:else}
          <button
            class="btn btn-ghost btn-circle btn-sm text-lg"
            on:click={() => (exprs = [...exprs.slice(0, i), ...exprs.slice(i + 1)])}
          >
            -
          </button>
        {/if}
        <input
          type="text"
          class="input input-info w-full"
          class:input-error={expr && errors[i]}
          bind:value={exprs[i]}
          placeholder="Input an expression..."
        />
      </div>
      <ErrorInfo error={errors[i]} {expr} />
    </div>
  {/each}
  {#if variables.length !== 0}
    <table class="table-compact table w-full table-fixed text-center">
      <thead>
        <tr>
          {#each variables as v}
            <th class="normal-case">{v}</th>
          {/each}
          {#each exprs as expr}
            <th class="normal-case">{expr}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#key mode}
          {#each results as rs, i}
            <tr class="hover">
              {#each variables.map((_, idx) => idx) as idx}
                <td>{display(!!(i & (1 << (variables.length - idx - 1))))}</td>
              {/each}
              {#each rs as r}
                <td>{display(r)}</td>
              {/each}
            </tr>
          {/each}
        {/key}
      </tbody>
    </table>
    <div class="flex justify-end gap-3">
      <label class="label cursor-pointer">
        <span class="label-text">0/1</span>
        <input type="radio" bind:group={mode} value="01" />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text">false/true</span>
        <input type="radio" bind:group={mode} value="ft" />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text">F/T</span>
        <input type="radio" bind:group={mode} value="FT" />
      </label>
    </div>
  {/if}
</div>
