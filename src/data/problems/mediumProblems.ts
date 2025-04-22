
import { ProblemData } from "./types";

export const mediumProblems: ProblemData[] = [
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
    </ul>`,
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
    </ul>`,
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
