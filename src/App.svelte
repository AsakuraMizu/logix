<script lang="ts">
  import { onMount } from 'svelte';
  import { InfoBar, RadioButton, TextBlock, TextBox } from 'fluent-svelte';
  import { init, process } from './lib/process';
  import Navbar from './lib/Navbar.svelte';

  let expr = '';
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

  onMount(() => init());

  let variables: string[] = [],
    result: boolean[] = [];
  let err: Error;
  $: {
    try {
      ({ variables, result } = process(expr));
      err = undefined;
    } catch (e) {
      err = e;
    }
  }
</script>

<Navbar />

<main class="bg-card h-screen">
  <div class="bg absolute -z-10 h-full w-full" />
  <div class="flex justify-center px-5 pt-20">
    <div class="w-full lg:w-3/5">
      <TextBox bind:value={expr} placeholder="Input an expression..." />
      <br />
      {#if err || !expr || variables.length === 0}
        {#if err && expr}
          <InfoBar severity="critical" closable={false} message={err.toString()} />
        {/if}
      {:else}
        <table class="table w-full table-fixed text-center">
          <thead class="bg-white bg-opacity-80 dark:bg-opacity-5">
            <tr class="border-b border-slate-400">
              {#each variables as v}
                <th class="py-1">{v}</th>
              {/each}
              <th class="py-1">{expr}</th>
            </tr>
          </thead>
          <tbody>
            {#key mode}
              {#each result as r, i}
                <tr class="border-b border-slate-400 bg-white bg-opacity-10 hover:bg-opacity-50">
                  {#each variables.map((_, idx) => idx) as idx}
                    <td class="py-1">{display(!!(i & (1 << (variables.length - idx - 1))))}</td>
                  {/each}
                  <td class="py-1">{display(r)}</td>
                </tr>
              {/each}
            {/key}
          </tbody>
        </table>
        <div class="flex justify-end gap-3">
          <RadioButton bind:group={mode} value="01">0/1</RadioButton>
          <RadioButton bind:group={mode} value="ft">false/true</RadioButton>
          <RadioButton bind:group={mode} value="FT">F/T</RadioButton>
        </div>
      {/if}
      <br />
      <TextBlock variant="title">Usage</TextBlock>
      <table class="w-full">
        <tbody>
          <tr>
            <td><code>! ~ ¬</code></td>
            <td>negation(not)</td>
          </tr>
          <tr>
            <td><code>& && ∧</code></td>
            <td>conjunction(and)</td>
          </tr>
          <tr>
            <td><code>| || ∨</code></td>
            <td>inclusive disjunction(or)</td>
          </tr>
          <tr>
            <td><code>> -> →</code></td>
            <td>material implication</td>
          </tr>
          <tr>
            <td><code>{'<>'} {'<->'} ↔ == ===</code></td>
            <td>material equivalence</td>
          </tr>
          <tr>
            <td><code>^ != !==</code></td>
            <td>exclusive disjunction(xor)</td>
          </tr>
          <tr>
            <td><code>↑</code></td>
            <td>negation of conjunction(nand)</td>
          </tr>
          <tr>
            <td><code>↓</code></td>
            <td>negation of disjunction(nor)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</main>

<style>
  .bg {
    background: url(/bloom-mica-light.png) center/cover no-repeat fixed;
  }

  @media (prefers-color-scheme: dark) {
    .bg {
      background: url(/bloom-mica-dark.png) center/cover no-repeat fixed;
    }
  }
</style>
