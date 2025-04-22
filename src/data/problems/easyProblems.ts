
import { ProblemData } from "./types";

export const easyProblems: ProblemData[] = [
  {
    title: "Two Sum",
    description: `<p>Дан массив целых чисел <code>nums</code> и целое число <code>target</code>, верните <em>индексы двух чисел таким образом, чтобы их сумма равнялась</em> <code>target</code>.</p>
    <p>Вы можете предположить, что для каждого входного набора существует <em>ровно одно решение</em>, и вы не можете использовать один и тот же элемент дважды.</p>
    <p>Вы можете вернуть ответ в любом порядке.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> nums = [2,7,11,15], target = 9
    <strong>Выход:</strong> [0,1]
    <strong>Объяснение:</strong> Так как nums[0] + nums[1] == 9, мы возвращаем [0, 1].
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> nums = [3,2,4], target = 6
    <strong>Выход:</strong> [1,2]
    </pre>

    <p><strong>Пример 3:</strong></p>
    <pre>
    <strong>Вход:</strong> nums = [3,3], target = 6
    <strong>Выход:</strong> [0,1]
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>2 <= nums.length <= 10<sup>4</sup></code></li>
        <li><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
        <li><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
        <li><em>Только одно валидное решение существует.</em></li>
    </ul>`,
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    acceptance_rate: 48.5,
    time_limit: 1000,
    memory_limit: 262144,
    sample_testcases: [
      {
        input: "[2,7,11,15]\n9",
        expected_output: "[0,1]",
        is_sample: true
      },
      {
        input: "[3,2,4]\n6",
        expected_output: "[1,2]",
        is_sample: true
      },
      {
        input: "[3,3]\n6",
        expected_output: "[0,1]",
        is_sample: true
      },
      {
        input: "[1,2,3,4,5]\n9",
        expected_output: "[3,4]",
        is_sample: false
      }
    ]
  },
  {
    title: "Палиндромное число",
    description: `<p>Дано целое число <code>x</code>, верните <code>true</code>, если <code>x</code> является палиндромом, и <code>false</code> в противном случае.</p>

    <p>Целое число является <em>палиндромом</em>, когда оно читается одинаково слева направо и справа налево.</p>
    <p>Например, <code>121</code> является палиндромом, в то время как <code>123</code> не является.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> x = 121
    <strong>Выход:</strong> true
    <strong>Объяснение:</strong> 121 читается как 121 слева направо и справа налево.
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> x = -121
    <strong>Выход:</strong> false
    <strong>Объяснение:</strong> Слева направо это -121. Справа налево это 121-. Следовательно, это не палиндром.
    </pre>

    <p><strong>Пример 3:</strong></p>
    <pre>
    <strong>Вход:</strong> x = 10
    <strong>Выход:</strong> false
    <strong>Объяснение:</strong> Читается как 01 справа налево. Следовательно, это не палиндром.
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>-2<sup>31</sup> <= x <= 2<sup>31</sup> - 1</code></li>
    </ul>`,
    difficulty: "easy",
    tags: ["Math"],
    acceptance_rate: 52.1,
    time_limit: 500,
    memory_limit: 131072,
    sample_testcases: [
      {
        input: "121",
        expected_output: "true",
        is_sample: true
      },
      {
        input: "-121",
        expected_output: "false",
        is_sample: true
      },
      {
        input: "10",
        expected_output: "false",
        is_sample: true
      },
      {
        input: "12321",
        expected_output: "true",
        is_sample: false
      }
    ]
  }
];
