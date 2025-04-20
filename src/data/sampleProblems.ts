
// Sample problems for our coding platform
// This data can be used to populate the database

export interface ProblemData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  acceptance_rate: number;
  time_limit: number; // in milliseconds
  memory_limit: number; // in bytes
  sample_testcases: {
    input: string;
    expected_output: string;
    is_sample: boolean;
  }[];
}

export const sampleProblems: ProblemData[] = [
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
    </ul>
    `,
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
    </ul>
    `,
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
  },
  {
    title: "Римские цифры в целые числа",
    description: `<p>Римские цифры представлены семью различными символами: <code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code> и <code>M</code>.</p>

    <pre>
    <strong>Символ</strong>       <strong>Значение</strong>
    I             1
    V             5
    X             10
    L             50
    C             100
    D             500
    M             1000</pre>

    <p>Например, <code>2</code> записывается как <code>II</code> в римской системе, что означает просто сложение двух единиц. <code>12</code> записывается как <code>XII</code>, что просто <code>X + II</code>. Число <code>27</code> записывается как <code>XXVII</code>, что есть <code>XX + V + II</code>.</p>

    <p>Римские цифры обычно записываются от наибольшей к наименьшей слева направо. Однако цифра <code>4</code> не записывается как <code>IIII</code>. Вместо этого цифра <code>4</code> записывается как <code>IV</code>. Поскольку <code>I</code> стоит перед <code>V</code>, мы вычитаем его, получая <code>4</code>. Тот же принцип применяется и к числу <code>9</code>, которое записывается как <code>IX</code>.</p>

    <p>Существует шесть случаев, когда используется вычитание:</p>
    <ul>
        <li><code>I</code> может быть помещена перед <code>V</code> (5) и <code>X</code> (10), чтобы получить 4 и 9.</li>
        <li><code>X</code> может быть помещена перед <code>L</code> (50) и <code>C</code> (100), чтобы получить 40 и 90.</li>
        <li><code>C</code> может быть помещена перед <code>D</code> (500) и <code>M</code> (1000), чтобы получить 400 и 900.</li>
    </ul>

    <p>Дана римская цифра, преобразуйте ее в целое число.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "III"
    <strong>Выход:</strong> 3
    <strong>Объяснение:</strong> III = 3.
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "LVIII"
    <strong>Выход:</strong> 58
    <strong>Объяснение:</strong> L = 50, V= 5, III = 3.
    </pre>

    <p><strong>Пример 3:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "MCMXCIV"
    <strong>Выход:</strong> 1994
    <strong>Объяснение:</strong> M = 1000, CM = 900, XC = 90 and IV = 4.
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>1 <= s.length <= 15</code></li>
        <li><code>s</code> содержит только символы <code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code>, <code>M</code>.</li>
        <li>Гарантируется, что <code>s</code> является допустимой римской цифрой в диапазоне <code>[1, 3999]</code>.</li>
    </ul>
    `,
    difficulty: "easy",
    tags: ["String", "Math", "Hash Table"],
    acceptance_rate: 58.6,
    time_limit: 800,
    memory_limit: 131072,
    sample_testcases: [
      {
        input: "III",
        expected_output: "3",
        is_sample: true
      },
      {
        input: "LVIII",
        expected_output: "58",
        is_sample: true
      },
      {
        input: "MCMXCIV",
        expected_output: "1994",
        is_sample: true
      },
      {
        input: "CDXLIV",
        expected_output: "444",
        is_sample: false
      }
    ]
  },
  {
    title: "Самая длинная подстрока без повторяющихся символов",
    description: `<p>Дана строка <code>s</code>, найдите длину самой длинной подстроки без повторяющихся символов.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "abcabcbb"
    <strong>Выход:</strong> 3
    <strong>Объяснение:</strong> Ответ - "abc", длина которого 3.
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "bbbbb"
    <strong>Выход:</strong> 1
    <strong>Объяснение:</strong> Ответ - "b", длина которого 1.
    </pre>

    <p><strong>Пример 3:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "pwwkew"
    <strong>Выход:</strong> 3
    <strong>Объяснение:</strong> Ответ - "wke", длина которого 3.
    Обратите внимание, что ответом должна быть подстрока, "pwke" - последовательность, а не подстрока.
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>0 <= s.length <= 5 * 10<sup>4</sup></code></li>
        <li><code>s</code> состоит из английских букв, цифр, символов и пробелов.</li>
    </ul>
    `,
    difficulty: "medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    acceptance_rate: 33.8,
    time_limit: 1500,
    memory_limit: 262144,
    sample_testcases: [
      {
        input: "abcabcbb",
        expected_output: "3",
        is_sample: true
      },
      {
        input: "bbbbb",
        expected_output: "1",
        is_sample: true
      },
      {
        input: "pwwkew",
        expected_output: "3",
        is_sample: true
      },
      {
        input: "aab",
        expected_output: "2",
        is_sample: false
      }
    ]
  },
  {
    title: "Zigzag Преобразование",
    description: `<p>Строка <code>"PAYPALISHIRING"</code> записывается в форме зигзага в заданном количестве строк следующим образом: (вы можете отобразить это шаблоном с фиксированной шириной шрифта)</p>

    <pre>
    P   A   H   N
    A P L S I I G
    Y   I   R
    </pre>

    <p>А затем читается построчно: <code>"PAHNAPLSIIGYIR"</code></p>

    <p>Напишите код, который принимает строку и количество строк, преобразует строку в описанный формат "зигзаг" и возвращает строку, полученную при чтении преобразованного шаблона построчно.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "PAYPALISHIRING", numRows = 3
    <strong>Выход:</strong> "PAHNAPLSIIGYIR"
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "PAYPALISHIRING", numRows = 4
    <strong>Выход:</strong> "PINALSIGYAHRPI"
    <strong>Объяснение:</strong>
    P     I    N
    A   L S  I G
    Y A   H R
    P     I
    </pre>

    <p><strong>Пример 3:</strong></p>
    <pre>
    <strong>Вход:</strong> s = "A", numRows = 1
    <strong>Выход:</strong> "A"
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>1 <= s.length <= 1000</code></li>
        <li><code>s</code> состоит из английских букв (нижнего и верхнего регистра), ',' и '.'.</li>
        <li><code>1 <= numRows <= 1000</code></li>
    </ul>
    `,
    difficulty: "medium",
    tags: ["String"],
    acceptance_rate: 42.5,
    time_limit: 1200,
    memory_limit: 196608,
    sample_testcases: [
      {
        input: "PAYPALISHIRING\n3",
        expected_output: "PAHNAPLSIIGYIR",
        is_sample: true
      },
      {
        input: "PAYPALISHIRING\n4",
        expected_output: "PINALSIGYAHRPI",
        is_sample: true
      },
      {
        input: "A\n1",
        expected_output: "A",
        is_sample: true
      },
      {
        input: "ABCDEFGHIJKLMN\n5",
        expected_output: "AIQBJPRCKOSDLNEM",
        is_sample: false
      }
    ]
  }
];

// Add more problems as needed
export const additionalProblems: ProblemData[] = [
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
    </ul>
    `,
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
  },
  {
    title: "Контейнер с наибольшим количеством воды",
    description: `<p>Вам даётся <code>n</code> неотрицательных целых чисел <code>a<sub>1</sub>, a<sub>2</sub>, ..., a<sub>n</sub></code> , где каждое представляет точку на координатной прямой (<code>i</code>, <code>a<sub>i</sub></code>). <code>n</code> вертикальных линий нарисованы таким образом, что две конечные точки <code>i</code>-й линии - это (<code>i</code>, <code>a<sub>i</sub></code>) и (<code>i</code>, <code>0</code>). Найдите две линии, которые вместе с осью x образуют контейнер, содержащий наибольшее количество воды.</p>

    <p><strong>Примечание:</strong> Контейнер не должен быть наклонным.</p>

    <p><strong>Пример 1:</strong></p>
    <pre>
    <strong>Вход:</strong> height = [1,8,6,2,5,4,8,3,7]
    <strong>Выход:</strong> 49
    <strong>Объяснение:</strong> Две линии - это [1,8] и [8,7] с координатами (1,8) и (9,7)
    </pre>

    <p><strong>Пример 2:</strong></p>
    <pre>
    <strong>Вход:</strong> height = [1,1]
    <strong>Выход:</strong> 1
    </pre>

    <p><strong>Ограничения:</strong></p>
    <ul>
        <li><code>n == height.length</code></li>
        <li><code>2 <= n <= 10<sup>5</sup></code></li>
        <li><code>0 <= height[i] <= 10<sup>4</sup></code></li>
    </ul>
    `,
    difficulty: "medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    acceptance_rate: 53.7,
    time_limit: 1500,
    memory_limit: 262144,
    sample_testcases: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        expected_output: "49",
        is_sample: true
      },
      {
        input: "[1,1]",
        expected_output: "1",
        is_sample: true
      },
      {
        input: "[4,3,2,1,4]",
        expected_output: "16",
        is_sample: false
      }
    ]
  }
];

// Merge all problem sets
export const allProblems = [...sampleProblems, ...additionalProblems];
