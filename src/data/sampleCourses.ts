
export interface CourseData {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

export const sampleCourses: CourseData[] = [
  {
    title: "Алгоритмы и структуры данных: основы",
    description: `<p>Базовый курс по алгоритмам и структурам данных. Вы изучите:</p>
    <ul>
      <li>Массивы и строки</li>
      <li>Связные списки</li>
      <li>Стеки и очереди</li>
      <li>Хеш-таблицы</li>
      <li>Основы временной сложности</li>
    </ul>`,
    difficulty: "beginner",
    tags: ["algorithms", "data structures", "arrays", "strings"]
  },
  {
    title: "Динамическое программирование",
    description: `<p>Углубленный курс по динамическому программированию:</p>
    <ul>
      <li>Основы DP</li>
      <li>Одномерное DP</li>
      <li>Двумерное DP</li>
      <li>Оптимизация состояний</li>
    </ul>`,
    difficulty: "intermediate",
    tags: ["algorithms", "dynamic programming"]
  },
  {
    title: "Графовые алгоритмы",
    description: `<p>Изучите основные алгоритмы на графах:</p>
    <ul>
      <li>Поиск в глубину (DFS)</li>
      <li>Поиск в ширину (BFS)</li>
      <li>Алгоритм Дейкстры</li>
      <li>Минимальное остовное дерево</li>
    </ul>`,
    difficulty: "intermediate",
    tags: ["algorithms", "graphs", "dfs", "bfs"]
  },
  {
    title: "Python для начинающих",
    description: `<p>Основы программирования на Python:</p>
    <ul>
      <li>Синтаксис Python</li>
      <li>Переменные и типы данных</li>
      <li>Условные операторы</li>
      <li>Циклы</li>
      <li>Функции</li>
    </ul>`,
    difficulty: "beginner",
    tags: ["python", "programming basics"]
  },
  {
    title: "Продвинутый JavaScript",
    description: `<p>Углубленное изучение JavaScript:</p>
    <ul>
      <li>Замыкания и область видимости</li>
      <li>Прототипы и наследование</li>
      <li>Асинхронное программирование</li>
      <li>Event Loop</li>
    </ul>`,
    difficulty: "advanced",
    tags: ["javascript", "web development", "async"]
  },
  {
    title: "Система контроля версий Git",
    description: `<p>Изучите Git от основ до продвинутых техник:</p>
    <ul>
      <li>Основные команды Git</li>
      <li>Ветвление и слияние</li>
      <li>Работа с удаленными репозиториями</li>
      <li>Git Flow</li>
    </ul>`,
    difficulty: "beginner",
    tags: ["git", "version control", "tools"]
  },
  {
    title: "Оптимизация SQL запросов",
    description: `<p>Научитесь писать эффективные SQL запросы:</p>
    <ul>
      <li>Индексы</li>
      <li>Оптимизация JOIN операций</li>
      <li>Анализ планов выполнения</li>
      <li>Материализованные представления</li>
    </ul>`,
    difficulty: "advanced",
    tags: ["databases", "sql", "optimization"]
  },
  {
    title: "Машинное обучение: введение",
    description: `<p>Базовые концепции машинного обучения:</p>
    <ul>
      <li>Линейная регрессия</li>
      <li>Логистическая регрессия</li>
      <li>Деревья решений</li>
      <li>Оценка моделей</li>
    </ul>`,
    difficulty: "intermediate",
    tags: ["machine learning", "data science", "python"]
  },
  {
    title: "Основы кибербезопасности",
    description: `<p>Изучите основы информационной безопасности:</p>
    <ul>
      <li>Криптография</li>
      <li>Сетевая безопасность</li>
      <li>Уязвимости веб-приложений</li>
      <li>Безопасность данных</li>
    </ul>`,
    difficulty: "intermediate",
    tags: ["security", "cryptography", "web security"]
  },
  {
    title: "Системное проектирование",
    description: `<p>Научитесь проектировать масштабируемые системы:</p>
    <ul>
      <li>Архитектурные паттерны</li>
      <li>Масштабирование</li>
      <li>Распределенные системы</li>
      <li>Микросервисы</li>
    </ul>`,
    difficulty: "advanced",
    tags: ["system design", "architecture", "distributed systems"]
  }
];
