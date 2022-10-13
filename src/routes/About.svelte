<div class="hero h-1/2">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Logix</h1>
      <p class="py-6">
        <i>THU 2022 Discrete Math Open Project</i>
        <br />
        Every things you need about logics
        <br />
        <del>WIP</del>
        <br />
        <br />
        <a
          class="link link-hover link-primary"
          href="https://github.com/AsakuraMizu/logix"
          target="_black"
        >
          View source code on GitHub
        </a>
      </p>
    </div>
  </div>
</div>
<div class="px-8">
  <h1 class="text-3xl font-semibold">Usage</h1>
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
    <code>0/1/false/true/F/T</code> is also allowed in input.
  </div>
  <h1 class="text-3xl font-semibold">Examples</h1>
  <ul class="list-inside list-disc">
    <li><code>a&T|false^1</code></li>
    <li><code>(!a1|!a2)>(a1&lt;>!a2)</code></li>
  </ul>
</div>
