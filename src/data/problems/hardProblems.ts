
import { ProblemData } from "./types";

export const hardProblems: ProblemData[] = [
  {
    title: "Медиана двух отсортированных массивов",
    description: `<p>Даны два отсортированных массива <code>nums1</code> и <code>nums2</code> размера <code>m</code> и <code>n</code> соответственно, найдите медиану двух отсортированных массивов.</p>
    
    <p>Общая сложность выполнения должна быть <code>O(log (m+n))</code>.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> nums1 = [1,3], nums2 = [2]
    <strong>Выход:</strong> 2.00000
    <strong>Объяснение:</strong> слитый массив = [1,2,3] и медиана - 2.
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> nums1 = [1,2], nums2 = [3,4]
    <strong>Выход:</strong> 2.50000
    <strong>Объяснение:</strong> слитый массив = [1,2,3,4] и медиана - (2 + 3) / 2 = 2.5.
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>nums1.length == m</code></li>
        <li><code>nums2.length == n</code></li>
        <li><code>0 <= m <= 1000</code></li>
        <li><code>0 <= n <= 1000</code></li>
        <li><code>1 <= m + n <= 2000</code></li>
        <li><code>-10<sup>6</sup> <= nums1[i], nums2[i] <= 10<sup>6</sup></code></li>
    </ul>`,
    difficulty: "hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance_rate: 33.5,
    time_limit: 2000,
    memory_limit: 262144,
    sample_testcases: [
      {
        input: "[1,3]\n[2]",
        expected_output: "2.00000",
        is_sample: true
      },
      {
        input: "[1,2]\n[3,4]",
        expected_output: "2.50000",
        is_sample: true
      },
      {
        input: "[0,0]\n[0,0]",
        expected_output: "0.00000",
        is_sample: false
      }
    ]
  }
];
