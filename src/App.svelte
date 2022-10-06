<script lang="ts">
  import { InfoBar, RadioButton, TextBlock, TextBox } from 'fluent-svelte';
  import process from './process';
  import Navbar from './Navbar.svelte';
  import { ParseError } from './parser/error';

  let expr = '';
  $: exprs = expr
    .replace(/^(,|;)/, '')
    .replace(/(,|;)$/, '')
    .split(/,|;/);
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
    results: boolean[][] = [];
  let err: Error | undefined;
  $: {
    try {
      ({ variables, results } = process(exprs));
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
          <InfoBar severity="critical" closable={false}>
            <div class="font-mono">
              {err.toString()}
              <br />
              {#if err instanceof ParseError}
                {expr}
                <br />
                {#each Array.from({ length: expr.length + 1 }).map((_, i) => i) as i}
                  {#if i < err.start || i > err.end}
                    &nbsp;
                  {:else}
                    ^
                  {/if}
                {/each}
              {/if}
            </div>
          </InfoBar>
        {/if}
      {:else}
        <table class="table w-full table-fixed text-center">
          <thead class="bg-white bg-opacity-80 dark:bg-opacity-5">
            <tr class="border-b border-slate-400">
              {#each variables as v}
                <th class="py-1">{v}</th>
              {/each}
              {#each exprs as expr}
                <th class="py-1">{expr}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#key mode}
              {#each results as rs, i}
                <tr class="border-b border-slate-400 bg-white bg-opacity-10 hover:bg-opacity-50">
                  {#each variables.map((_, idx) => idx) as idx}
                    <td class="py-1">{display(!!(i & (1 << (variables.length - idx - 1))))}</td>
                  {/each}
                  {#each rs as r}
                    <td class="py-1">{display(r)}</td>
                  {/each}
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
      <div>
        Additionally, you can use<code>,</code> or <code>;</code> to split multiple expressions to calculate
        their values at the same time.
      </div>
      <div>
        <code>0/1/false/true/F/T</code> is also allowed in input.
      </div>
      <TextBlock variant="title">Examples</TextBlock>
      <ul class="list-inside list-disc">
        <li><code>a&T|false^1</code></li>
        <li><code>(!a1|!a2)>(a1&lt;>!a2);a1|a2</code></li>
      </ul>
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
