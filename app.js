/**
 * Интерактивный комплекс для учителя: «Часть множества»
 * Поддержка 4 разделов учебной программы:
 * - Раздел 1: «Для нахождения ответа выделите группы кружочков» (визуальные группы)
 * - Раздел 2: «Найдите значения выражений» (голубая таблица 2x2)
 * - Раздел 3: Текстовая задача — нахождение оставшейся части множества (с полоской долей)
 * - Раздел 4: Текстовая задача — нахождение целого числа по его дроби (с полоской долей)
 */

// ==========================================================================
// 1. Звуковые эффекты (Web Audio API)
// ==========================================================================
class SoundPlayer {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('teacher_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('teacher_sound_muted', this.muted);
    return this.muted;
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  playReveal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }
}

const sounds = new SoundPlayer();

// ==========================================================================
// 2. Готовые комплекты заданий (Разделы 1, 2, 3, 4)
// ==========================================================================
const PRESET_SETS = [
  // Комплект №1
  {
    name: 'Набор №1',
    section1: [
      {
        id: 's1-sample-1',
        isSample: true,
        label: 'Образец:',
        num: 3,
        den: 4,
        total: 16,
        itemsPerGroup: 4,
        unit: 'части',
        color: 'purple',
        selectedGroups: [0, 1, 2],
        showAnswer: true,
        showSolution: true
      },
      {
        id: 's1-task-1-a',
        isSample: false,
        label: 'a)',
        num: 2,
        den: 5,
        total: 15,
        itemsPerGroup: 3,
        unit: 'части',
        color: 'green',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-1-b',
        isSample: false,
        label: 'b)',
        num: 5,
        den: 8,
        total: 32,
        itemsPerGroup: 4,
        unit: 'частей',
        color: 'orange',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-1-c',
        isSample: false,
        label: 'c)',
        num: 4,
        den: 7,
        total: 28,
        itemsPerGroup: 4,
        unit: 'части',
        color: 'blue',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      }
    ],
    section2: [
      {
        id: 's2-task-1-a',
        label: 'a)',
        num: 1,
        den: 3,
        total: 18,
        unit: 'часть',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-1-b',
        label: 'b)',
        num: 4,
        den: 5,
        total: 25,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-1-c',
        label: 'c)',
        num: 3,
        den: 8,
        total: 480,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-1-d',
        label: 'd)',
        num: 5,
        den: 9,
        total: 378,
        unit: 'частей',
        showAnswer: false,
        showSolution: false
      }
    ],
    task3: {
      id: 'task-3-set1',
      badge: '3',
      character: 'У Малики',
      itemName: 'наклеек',
      itemSingle: 'наклейка',
      total: 48,
      num: 1,
      den: 6,
      knownPartLabel: 'с животными',
      targetPartLabel: 'с цветами',
      question: 'Сколько наклеек с цветами у Малики?',
      showAnswer: false,
      showSolution: false
    },
    task4: {
      id: 'task-4-set1',
      badge: '4',
      character: 'Бабушка',
      action: 'испекла пирожки',
      num: 3,
      den: 8,
      knownCount: 24,
      knownPartLabel: 'с вишней',
      otherPartLabel: 'с яблоками',
      question: 'Сколько всего пирожков испекла бабушка, если с вишней было 24 пирожка?',
      itemTotalName: 'пирожков',
      showAnswer: false,
      showSolution: false
    }
  },

  // Комплект №2
  {
    name: 'Набор №2',
    section1: [
      {
        id: 's1-sample-2',
        isSample: true,
        label: 'Образец:',
        num: 2,
        den: 3,
        total: 15,
        itemsPerGroup: 5,
        unit: 'части',
        color: 'purple',
        selectedGroups: [0, 1],
        showAnswer: true,
        showSolution: true
      },
      {
        id: 's1-task-2-a',
        isSample: false,
        label: 'a)',
        num: 3,
        den: 5,
        total: 25,
        itemsPerGroup: 5,
        unit: 'части',
        color: 'green',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-2-b',
        isSample: false,
        label: 'b)',
        num: 3,
        den: 8,
        total: 24,
        itemsPerGroup: 3,
        unit: 'части',
        color: 'orange',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-2-c',
        isSample: false,
        label: 'c)',
        num: 5,
        den: 6,
        total: 18,
        itemsPerGroup: 3,
        unit: 'частей',
        color: 'blue',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      }
    ],
    section2: [
      {
        id: 's2-task-2-a',
        label: 'a)',
        num: 1,
        den: 5,
        total: 25,
        unit: 'часть',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-2-b',
        label: 'b)',
        num: 3,
        den: 7,
        total: 21,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-2-c',
        label: 'c)',
        num: 5,
        den: 6,
        total: 420,
        unit: 'частей',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-2-d',
        label: 'd)',
        num: 4,
        den: 7,
        total: 392,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      }
    ],
    task3: {
      id: 'task-3-set2',
      badge: '3',
      character: 'У Тимура',
      itemName: 'значков',
      itemSingle: 'значок',
      total: 45,
      num: 1,
      den: 5,
      knownPartLabel: 'спортивные',
      targetPartLabel: 'космические',
      question: 'Сколько космических значков у Тимура?',
      showAnswer: false,
      showSolution: false
    },
    task4: {
      id: 'task-4-set2',
      badge: '4',
      character: 'Гульноза',
      action: 'приготовила самсу',
      num: 5,
      den: 7,
      knownCount: 35,
      knownPartLabel: 'с мясом',
      otherPartLabel: 'с тыквой',
      question: 'Сколько всего самсы приготовила Гульноза, если с мясом было 35 самсы?',
      itemTotalName: 'самсы',
      showAnswer: false,
      showSolution: false
    }
  },

  // Комплект №3
  {
    name: 'Набор №3',
    section1: [
      {
        id: 's1-sample-3',
        isSample: true,
        label: 'Образец:',
        num: 3,
        den: 5,
        total: 10,
        itemsPerGroup: 2,
        unit: 'части',
        color: 'purple',
        selectedGroups: [0, 1, 2],
        showAnswer: true,
        showSolution: true
      },
      {
        id: 's1-task-3-a',
        isSample: false,
        label: 'a)',
        num: 3,
        den: 4,
        total: 20,
        itemsPerGroup: 5,
        unit: 'части',
        color: 'green',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-3-b',
        isSample: false,
        label: 'b)',
        num: 4,
        den: 9,
        total: 18,
        itemsPerGroup: 2,
        unit: 'части',
        color: 'orange',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's1-task-3-c',
        isSample: false,
        label: 'c)',
        num: 3,
        den: 7,
        total: 14,
        itemsPerGroup: 2,
        unit: 'части',
        color: 'blue',
        selectedGroups: [],
        showAnswer: false,
        showSolution: false
      }
    ],
    section2: [
      {
        id: 's2-task-3-a',
        label: 'a)',
        num: 1,
        den: 6,
        total: 24,
        unit: 'часть',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-3-b',
        label: 'b)',
        num: 2,
        den: 3,
        total: 27,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-3-c',
        label: 'c)',
        num: 4,
        den: 9,
        total: 630,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      },
      {
        id: 's2-task-3-d',
        label: 'd)',
        num: 3,
        den: 8,
        total: 512,
        unit: 'части',
        showAnswer: false,
        showSolution: false
      }
    ],
    task3: {
      id: 'task-3-set3',
      badge: '3',
      character: 'В коробке',
      itemName: 'карандашей',
      itemSingle: 'карандаш',
      total: 42,
      num: 1,
      den: 7,
      knownPartLabel: 'простые',
      targetPartLabel: 'цветные',
      question: 'Сколько цветных карандашей в коробке?',
      showAnswer: false,
      showSolution: false
    },
    task4: {
      id: 'task-4-set3',
      badge: '4',
      character: 'Мастер',
      action: 'изготовил глиняные кувшины',
      num: 4,
      den: 9,
      knownCount: 36,
      knownPartLabel: 'с росписью',
      otherPartLabel: 'простые',
      question: 'Сколько всего кувшинов изготовил мастер, если с росписью было 36 кувшинов?',
      itemTotalName: 'кувшинов',
      showAnswer: false,
      showSolution: false
    }
  }
];

// ==========================================================================
// 3. Главный класс TeacherDeskApp
// ==========================================================================
class TeacherDeskApp {
  constructor() {
    this.currentSetIndex = 0;
    this.section1Tasks = JSON.parse(JSON.stringify(PRESET_SETS[0].section1));
    this.section2Tasks = JSON.parse(JSON.stringify(PRESET_SETS[0].section2));
    this.task3 = JSON.parse(JSON.stringify(PRESET_SETS[0].task3));
    this.task4 = JSON.parse(JSON.stringify(PRESET_SETS[0].task4));
    this.masterShowAnswers = false;
    this.editingTaskId = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.tasksContainer1 = document.getElementById('tasksContainer1');
    this.tasksContainer2 = document.getElementById('tasksContainer2');
    this.taskCard3 = document.getElementById('taskCard3');
    this.taskCard4 = document.getElementById('taskCard4');

    this.teacherAnswersToggle = document.getElementById('teacherAnswersToggle');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.generateVariantBtn = document.getElementById('generateVariantBtn');
    this.openConstructorBtn = document.getElementById('openConstructorBtn');
    this.printStudentBtn = document.getElementById('printStudentBtn');
    this.printTeacherBtn = document.getElementById('printTeacherBtn');
    this.resetBoardBtn = document.getElementById('resetBoardBtn');
    this.printVariantLabel = document.getElementById('printVariantLabel');
    this.tasksCountBadge = document.getElementById('tasksCountBadge');
    this.setPillsContainer = document.getElementById('setPillsContainer');

    // Модальное окно конструктора
    this.constructorModal = document.getElementById('constructorModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.closeConstructorBtn = document.getElementById('closeConstructorBtn');
    this.cancelConstructorBtn = document.getElementById('cancelConstructorBtn');
    this.customTaskForm = document.getElementById('customTaskForm');
    this.taskNumInput = document.getElementById('taskNum');
    this.taskDenInput = document.getElementById('taskDen');
    this.taskItemsInput = document.getElementById('taskItemsPerGroup');
    this.previewEquation = document.getElementById('previewEquation');
    this.previewDetails = document.getElementById('previewDetails');
    this.saveTaskBtn = document.getElementById('saveTaskBtn');

    this.updateSoundIcon();
  }

  bindEvents() {
    // Переключение готовых наборов
    if (this.setPillsContainer) {
      this.setPillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-set');
        if (!btn) return;
        const setIndex = parseInt(btn.dataset.setIndex, 10);
        this.loadSet(setIndex);
      });
    }

    // Мастер-переключатель ответов учителя (на все 4 задания)
    this.teacherAnswersToggle.addEventListener('change', (e) => {
      this.masterShowAnswers = e.target.checked;
      sounds.playReveal();

      // Раздел 1
      this.section1Tasks.forEach(task => {
        if (!task.isSample) {
          task.showAnswer = this.masterShowAnswers;
          task.showSolution = this.masterShowAnswers;
          if (this.masterShowAnswers) {
            task.selectedGroups = Array.from({ length: task.num }, (_, i) => i);
          } else {
            task.selectedGroups = [];
          }
        }
      });

      // Раздел 2
      this.section2Tasks.forEach(task => {
        task.showAnswer = this.masterShowAnswers;
        task.showSolution = this.masterShowAnswers;
      });

      // Раздел 3 и 4
      this.task3.showAnswer = this.masterShowAnswers;
      this.task3.showSolution = this.masterShowAnswers;
      this.task4.showAnswer = this.masterShowAnswers;
      this.task4.showSolution = this.masterShowAnswers;

      this.render();
    });

    // Звук
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      this.updateSoundIcon();
      if (!isMuted) sounds.playPop();
    });

    // На весь экран
    this.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });

    // Генерация случайного нового варианта (на все 4 раздела)
    this.generateVariantBtn.addEventListener('click', () => {
      this.generateRandomNewVariant();
    });

    // Открытие конструктора
    this.openConstructorBtn.addEventListener('click', () => {
      this.editingTaskId = null;
      this.modalTitle.textContent = '🛠️ Добавить задание в Раздел 1';
      this.saveTaskBtn.textContent = 'Добавить в карточку';
      this.taskNumInput.value = 3;
      this.taskDenInput.value = 5;
      this.taskItemsInput.value = 4;
      this.updateModalPreview();
      this.constructorModal.classList.remove('hidden');
    });

    this.closeConstructorBtn.addEventListener('click', () => {
      this.constructorModal.classList.add('hidden');
    });

    this.cancelConstructorBtn.addEventListener('click', () => {
      this.constructorModal.classList.add('hidden');
    });

    const previewHandler = () => this.updateModalPreview();
    this.taskNumInput.addEventListener('input', previewHandler);
    this.taskDenInput.addEventListener('input', previewHandler);
    this.taskItemsInput.addEventListener('input', previewHandler);

    this.customTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTaskFromModal();
    });

    // Сброс доски
    this.resetBoardBtn.addEventListener('click', () => {
      sounds.playPop();
      this.section1Tasks.forEach(task => {
        if (!task.isSample) {
          task.selectedGroups = [];
          if (!this.masterShowAnswers) {
            task.showAnswer = false;
            task.showSolution = false;
          }
        }
      });
      if (!this.masterShowAnswers) {
        this.section2Tasks.forEach(task => {
          task.showAnswer = false;
          task.showSolution = false;
        });
        this.task3.showAnswer = false;
        this.task3.showSolution = false;
        this.task4.showAnswer = false;
        this.task4.showSolution = false;
      }
      this.render();
    });

    // Печать для учеников
    this.printStudentBtn.addEventListener('click', () => {
      this.printWorksheet(false);
    });

    // Печать для учителя
    this.printTeacherBtn.addEventListener('click', () => {
      this.printWorksheet(true);
    });
  }

  loadSet(setIndex) {
    if (setIndex < 0 || setIndex >= PRESET_SETS.length) return;
    this.currentSetIndex = setIndex;

    const buttons = this.setPillsContainer.querySelectorAll('.btn-set');
    buttons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === setIndex);
    });

    const set = PRESET_SETS[setIndex];
    this.section1Tasks = JSON.parse(JSON.stringify(set.section1));
    this.section2Tasks = JSON.parse(JSON.stringify(set.section2));
    this.task3 = JSON.parse(JSON.stringify(set.task3));
    this.task4 = JSON.parse(JSON.stringify(set.task4));
    this.printVariantLabel.textContent = `Набор №${setIndex + 1}`;

    if (this.masterShowAnswers) {
      this.section1Tasks.forEach(t => {
        if (!t.isSample) {
          t.showAnswer = true;
          t.showSolution = true;
          t.selectedGroups = Array.from({ length: t.num }, (_, i) => i);
        }
      });
      this.section2Tasks.forEach(t => {
        t.showAnswer = true;
        t.showSolution = true;
      });
      this.task3.showAnswer = true;
      this.task3.showSolution = true;
      this.task4.showAnswer = true;
      this.task4.showSolution = true;
    }

    sounds.playReveal();
    this.render();
  }

  updateSoundIcon() {
    this.soundIcon.textContent = sounds.muted ? '🔇' : '🔊';
  }

  updateModalPreview() {
    let num = parseInt(this.taskNumInput.value, 10) || 1;
    let den = parseInt(this.taskDenInput.value, 10) || 2;
    let items = parseInt(this.taskItemsInput.value, 10) || 1;

    if (num >= den) {
      num = den - 1;
      this.taskNumInput.value = num;
    }

    const total = den * items;
    const answer = num * items;

    this.previewEquation.innerHTML = `
      <span class="frac"><sup>${num}</sup>&frasl;<sub>${den}</sub></span> частей от числа <strong>${total}</strong> = <strong>${answer}</strong>
    `;
    this.previewDetails.textContent = `(${den} столбиков по ${items} кружка, ответ: ${answer})`;
  }

  saveTaskFromModal() {
    const num = parseInt(this.taskNumInput.value, 10);
    const den = parseInt(this.taskDenInput.value, 10);
    const items = parseInt(this.taskItemsInput.value, 10);
    const color = this.customTaskForm.querySelector('input[name="circleColor"]:checked').value;
    const total = den * items;
    const unit = num === 1 ? 'часть' : (num >= 2 && num <= 4 ? 'части' : 'частей');

    if (this.editingTaskId) {
      const task = this.section1Tasks.find(t => t.id === this.editingTaskId);
      if (task) {
        task.num = num;
        task.den = den;
        task.itemsPerGroup = items;
        task.total = total;
        task.color = color;
        task.unit = unit;
        task.selectedGroups = this.masterShowAnswers ? Array.from({ length: num }, (_, i) => i) : [];
      }
    } else {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const nonSampleCount = this.section1Tasks.filter(t => !t.isSample).length;
      const label = (letters[nonSampleCount] || nonSampleCount + 1) + ')';

      const newTask = {
        id: 's1-task-custom-' + Date.now(),
        isSample: false,
        label: label,
        num: num,
        den: den,
        total: total,
        itemsPerGroup: items,
        unit: unit,
        color: color,
        selectedGroups: this.masterShowAnswers ? Array.from({ length: num }, (_, i) => i) : [],
        showAnswer: this.masterShowAnswers,
        showSolution: this.masterShowAnswers
      };
      this.section1Tasks.push(newTask);
    }

    this.constructorModal.classList.add('hidden');
    sounds.playReveal();
    this.render();
  }

  openEditModal(taskId) {
    const task = this.section1Tasks.find(t => t.id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    this.modalTitle.textContent = `✏️ Редактировать задание ${task.label}`;
    this.saveTaskBtn.textContent = 'Сохранить изменения';

    this.taskNumInput.value = task.num;
    this.taskDenInput.value = task.den;
    this.taskItemsInput.value = task.itemsPerGroup;

    const colorRadio = this.customTaskForm.querySelector(`input[name="circleColor"][value="${task.color}"]`);
    if (colorRadio) colorRadio.checked = true;

    this.updateModalPreview();
    this.constructorModal.classList.remove('hidden');
  }

  deleteTask(taskId) {
    if (confirm('Удалить это задание из списка?')) {
      this.section1Tasks = this.section1Tasks.filter(t => t.id !== taskId);
      sounds.playPop();
      this.render();
    }
  }

  generateRandomNewVariant() {
    const buttons = this.setPillsContainer.querySelectorAll('.btn-set');
    buttons.forEach(btn => btn.classList.remove('active'));

    this.printVariantLabel.textContent = `Случайный вариант`;

    const colors = ['green', 'orange', 'blue', 'purple', 'teal'];

    // Раздел 1
    const bank1 = [
      { den: 4, items: 4, num: 3, unit: 'части' },
      { den: 5, items: 3, num: 2, unit: 'части' },
      { den: 8, items: 4, num: 5, unit: 'частей' },
      { den: 7, items: 4, num: 4, unit: 'части' },
      { den: 5, items: 4, num: 3, unit: 'части' }
    ];
    const chosen1 = bank1.sort(() => Math.random() - 0.5).slice(0, 3);
    const letters = ['a)', 'b)', 'c)'];
    const newSample = {
      id: 's1-sample-rand',
      isSample: true,
      label: 'Образец:',
      num: 2,
      den: 4,
      total: 12,
      itemsPerGroup: 3,
      unit: 'части',
      color: 'purple',
      selectedGroups: [0, 1],
      showAnswer: true,
      showSolution: true
    };
    const newTasks1 = [newSample];
    chosen1.forEach((item, idx) => {
      newTasks1.push({
        id: 's1-rand-' + Date.now() + '-' + idx,
        isSample: false,
        label: letters[idx],
        num: item.num,
        den: item.den,
        total: item.den * item.items,
        itemsPerGroup: item.items,
        unit: item.unit,
        color: colors[idx % colors.length],
        selectedGroups: this.masterShowAnswers ? Array.from({ length: item.num }, (_, i) => i) : [],
        showAnswer: this.masterShowAnswers,
        showSolution: this.masterShowAnswers
      });
    });

    // Раздел 2
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const newTasks2 = [
      { id: 's2-rand-a', label: 'a)', num: 1, den: 4, total: 24, unit: 'часть', showAnswer: this.masterShowAnswers, showSolution: this.masterShowAnswers },
      { id: 's2-rand-b', label: 'b)', num: 3, den: 5, total: 30, unit: 'части', showAnswer: this.masterShowAnswers, showSolution: this.masterShowAnswers },
      { id: 's2-rand-c', label: 'c)', num: 4, den: 7, total: 490, unit: 'части', showAnswer: this.masterShowAnswers, showSolution: this.masterShowAnswers },
      { id: 's2-rand-d', label: 'd)', num: 5, den: 8, total: 432, unit: 'частей', showAnswer: this.masterShowAnswers, showSolution: this.masterShowAnswers }
    ];

    // Раздел 3 (Задача на остаток множества)
    const task3Options = [
      { character: 'У Зарины', itemName: 'шариков', total: 40, num: 1, den: 5, knownPartLabel: 'зелёные', targetPartLabel: 'жёлтые', question: 'Сколько жёлтых шариков у Зарины?' },
      { character: 'У Алишера', itemName: 'машинок', total: 36, num: 1, den: 4, knownPartLabel: 'грузовые', targetPartLabel: 'легковые', question: 'Сколько легковых машинок у Алишера?' },
      { character: 'В саду', itemName: 'деревьев', total: 54, num: 1, den: 6, knownPartLabel: 'вишни', targetPartLabel: 'яблони', question: 'Сколько яблонь в саду?' }
    ];
    const chosenT3 = pick(task3Options);
    this.task3 = {
      id: 't3-rand-' + Date.now(),
      badge: '3',
      ...chosenT3,
      showAnswer: this.masterShowAnswers,
      showSolution: this.masterShowAnswers
    };

    // Раздел 4 (Задача на целое по его дроби)
    const task4Options = [
      { character: 'Шеф-повар', action: 'приготовил порции плова', num: 3, den: 7, knownCount: 27, knownPartLabel: 'с изюмом', otherPartLabel: 'без изюма', question: 'Сколько всего порций плова приготовил шеф-повар, если с изюмом было 27 порций?', itemTotalName: 'порций' },
      { character: 'Мадина', action: 'испекла кексы', num: 4, den: 9, knownCount: 28, knownPartLabel: 'с шоколадом', otherPartLabel: 'с ванилью', question: 'Сколько всего кексов испекла Мадина, если с шоколадом было 28 кексов?', itemTotalName: 'кексов' }
    ];
    const chosenT4 = pick(task4Options);
    this.task4 = {
      id: 't4-rand-' + Date.now(),
      badge: '4',
      ...chosenT4,
      showAnswer: this.masterShowAnswers,
      showSolution: this.masterShowAnswers
    };

    this.section1Tasks = newTasks1;
    this.section2Tasks = newTasks2;
    sounds.playReveal();
    this.render();
  }

  toggleGroupSelection(taskId, colIndex) {
    const task = this.section1Tasks.find(t => t.id === taskId);
    if (!task) return;

    sounds.playPop();
    const idx = task.selectedGroups.indexOf(colIndex);
    if (idx > -1) {
      task.selectedGroups.splice(idx, 1);
    } else {
      task.selectedGroups.push(colIndex);
    }
    this.render();
  }

  toggleSection1Answer(taskId) {
    const task = this.section1Tasks.find(t => t.id === taskId);
    if (!task) return;

    sounds.playReveal();
    task.showAnswer = !task.showAnswer;
    if (task.showAnswer && task.selectedGroups.length === 0) {
      task.selectedGroups = Array.from({ length: task.num }, (_, i) => i);
    }
    this.render();
  }

  toggleSection1Solution(taskId) {
    const task = this.section1Tasks.find(t => t.id === taskId);
    if (!task) return;

    sounds.playPop();
    task.showSolution = !task.showSolution;
    this.render();
  }

  toggleSection2Answer(taskId) {
    const task = this.section2Tasks.find(t => t.id === taskId);
    if (!task) return;

    sounds.playReveal();
    task.showAnswer = !task.showAnswer;
    task.showSolution = task.showAnswer;
    this.render();
  }

  toggleTask3Answer() {
    sounds.playReveal();
    this.task3.showAnswer = !this.task3.showAnswer;
    this.task3.showSolution = this.task3.showAnswer;
    this.render();
  }

  toggleTask4Answer() {
    sounds.playReveal();
    this.task4.showAnswer = !this.task4.showAnswer;
    this.task4.showSolution = this.task4.showAnswer;
    this.render();
  }

  printWorksheet(withAnswers) {
    const orig1 = this.section1Tasks.map(t => ({ id: t.id, showAnswer: t.showAnswer, showSolution: t.showSolution, selectedGroups: [...t.selectedGroups] }));
    const orig2 = this.section2Tasks.map(t => ({ id: t.id, showAnswer: t.showAnswer, showSolution: t.showSolution }));
    const orig3 = { showAnswer: this.task3.showAnswer, showSolution: this.task3.showSolution };
    const orig4 = { showAnswer: this.task4.showAnswer, showSolution: this.task4.showSolution };

    this.section1Tasks.forEach(t => {
      if (!t.isSample) {
        t.showAnswer = withAnswers;
        t.showSolution = withAnswers;
        t.selectedGroups = withAnswers ? Array.from({ length: t.num }, (_, i) => i) : [];
      }
    });
    this.section2Tasks.forEach(t => {
      t.showAnswer = withAnswers;
      t.showSolution = withAnswers;
    });
    this.task3.showAnswer = withAnswers;
    this.task3.showSolution = withAnswers;
    this.task4.showAnswer = withAnswers;
    this.task4.showSolution = withAnswers;

    this.render();

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        orig1.forEach(o => {
          const t = this.section1Tasks.find(x => x.id === o.id);
          if (t) { t.showAnswer = o.showAnswer; t.showSolution = o.showSolution; t.selectedGroups = o.selectedGroups; }
        });
        orig2.forEach(o => {
          const t = this.section2Tasks.find(x => x.id === o.id);
          if (t) { t.showAnswer = o.showAnswer; t.showSolution = o.showSolution; }
        });
        this.task3.showAnswer = orig3.showAnswer;
        this.task3.showSolution = orig3.showSolution;
        this.task4.showAnswer = orig4.showAnswer;
        this.task4.showSolution = orig4.showSolution;
        this.render();
      }, 500);
    }, 200);
  }

  // ==========================================================================
  // 4. Отрисовка страницы (Разделы 1, 2, 3, 4)
  // ==========================================================================
  render() {
    this.renderSection1();
    this.renderSection2();
    this.renderSection3();
    this.renderSection4();

    const count1 = this.section1Tasks.filter(t => !t.isSample).length;
    const count2 = this.section2Tasks.length;
    this.tasksCountBadge.textContent = `${count1 + count2 + 2} заданий для урока`;
  }

  renderSection1() {
    this.tasksContainer1.innerHTML = '';
    this.section1Tasks.forEach(task => {
      const card = this.createSection1Card(task);
      this.tasksContainer1.appendChild(card);
    });
  }

  createSection1Card(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.isSample ? 'sample-card' : ''}`;
    card.id = task.id;

    const answerValue = (task.total / task.den) * task.num;
    const selectedCount = task.selectedGroups.length;
    const selectedDots = selectedCount * task.itemsPerGroup;

    const sampleBadge = task.isSample ? `<div class="sample-badge">Образец:</div>` : '';

    let answerDisplayHtml = '';
    if (task.isSample || task.showAnswer) {
      answerDisplayHtml = `<span class="task-answer-display revealed">${answerValue}</span>`;
    } else {
      answerDisplayHtml = `<span class="task-answer-display hidden-answer">?</span>`;
    }

    const mathStatementHtml = `
      <div class="task-statement">
        ${!task.isSample ? `<span class="task-label">${task.label}</span>` : ''}
        <div class="fraction-box">
          <span class="numerator">${task.num}</span>
          <span class="denominator">${task.den}</span>
        </div>
        <div class="task-text">
          <span>${task.unit} от числа ${task.total} = </span>
          ${answerDisplayHtml}
        </div>
      </div>
    `;

    const columnsHtml = Array.from({ length: task.den }).map((_, colIdx) => {
      const isSelected = task.selectedGroups.includes(colIdx);
      const selectedClass = isSelected ? 'selected' : '';

      const dotsHtml = Array.from({ length: task.itemsPerGroup }).map(() => {
        return `<div class="circle-dot"></div>`;
      }).join('');

      return `
        <div 
          class="circle-column-group color-${task.color} ${selectedClass}" 
          data-task-id="${task.id}" 
          data-col-index="${colIdx}"
          title="Столбик ${colIdx + 1} из ${task.den} (${task.itemsPerGroup} кружка)"
        >
          ${dotsHtml}
        </div>
      `;
    }).join('');

    const visualHtml = `
      <div class="task-visualization">
        ${columnsHtml}
      </div>
    `;

    let footerHtml = '';
    if (!task.isSample) {
      footerHtml = `
        <div class="task-footer">
          <div class="group-status-pill">
            <span>Выделено у доски:</span>
            <span class="pill-number"><strong>${selectedCount}</strong> из <strong>${task.den}</strong> столбиков</span>
            <span>(${selectedDots} кружков)</span>
          </div>

          <div class="teacher-item-actions">
            <button class="btn btn-sm btn-toggle-answer ${task.showAnswer ? 'active' : ''}" data-task-id="${task.id}" title="Показать или скрыть ответ">
              ${task.showAnswer ? '🙈 Скрыть ответ' : `👁️ Ответ: ${answerValue}`}
            </button>
            <button class="btn btn-sm btn-secondary toggle-solution-btn" data-task-id="${task.id}" title="Показать формулу решения">
              ${task.showSolution ? 'Скрыть разбор' : '📝 Разбор решения'}
            </button>
            <button class="btn btn-sm btn-edit-item" data-task-id="${task.id}" title="Изменить числа в задании">
              ✏️ Изменить
            </button>
            <button class="btn btn-sm btn-delete-item" data-task-id="${task.id}" title="Удалить задание">
              🗑️
            </button>
          </div>
        </div>
      `;
    }

    let solutionHtml = '';
    if (task.showSolution || task.isSample) {
      solutionHtml = `
        <div class="solution-breakdown">
          <h4>💡 Математический разбор для доски:</h4>
          <div class="solution-formula">
            ${task.total} ÷ ${task.den} × ${task.num} = ${answerValue}
          </div>
          <div class="solution-step">
            <span class="step-num">1</span>
            <span><strong>Делим на знаменатель:</strong> ${task.total} ÷ ${task.den} = <strong>${task.itemsPerGroup}</strong> кружка в одном столбике.</span>
          </div>
          <div class="solution-step">
            <span class="step-num">2</span>
            <span><strong>Умножаем на числитель:</strong> ${task.itemsPerGroup} × ${task.num} = <strong>${answerValue}</strong> кружков всего.</span>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      ${sampleBadge}
      <div class="task-body">
        ${mathStatementHtml}
        ${visualHtml}
      </div>
      ${footerHtml}
      ${solutionHtml}
    `;

    const cols = card.querySelectorAll('.circle-column-group');
    cols.forEach(col => {
      col.addEventListener('click', () => {
        const colIdx = parseInt(col.dataset.colIndex, 10);
        this.toggleGroupSelection(task.id, colIdx);
      });
    });

    if (!task.isSample) {
      const ansBtn = card.querySelector('.btn-toggle-answer');
      if (ansBtn) ansBtn.addEventListener('click', () => this.toggleSection1Answer(task.id));

      const solBtn = card.querySelector('.toggle-solution-btn');
      if (solBtn) solBtn.addEventListener('click', () => this.toggleSection1Solution(task.id));

      const editBtn = card.querySelector('.btn-edit-item');
      if (editBtn) editBtn.addEventListener('click', () => this.openEditModal(task.id));

      const delBtn = card.querySelector('.btn-delete-item');
      if (delBtn) delBtn.addEventListener('click', () => this.deleteTask(task.id));
    }

    return card;
  }

  renderSection2() {
    this.tasksContainer2.innerHTML = '';
    this.section2Tasks.forEach(task => {
      const cell = this.createSection2Cell(task);
      this.tasksContainer2.appendChild(cell);
    });
  }

  createSection2Cell(task) {
    const cell = document.createElement('div');
    cell.className = 'task2-cell';
    cell.id = task.id;

    const answerValue = Math.round((task.total / task.den) * task.num);
    const stepOne = task.total / task.den;

    let answerHtml = '';
    if (task.showAnswer) {
      answerHtml = `<span class="task-answer-display revealed">${answerValue}</span>`;
    } else {
      answerHtml = `<span class="task-answer-display hidden-answer">?</span>`;
    }

    let calculationHint = '';
    if (task.num === 1) {
      calculationHint = `${task.total} ÷ ${task.den} = ${answerValue}`;
    } else {
      calculationHint = `${task.total} ÷ ${task.den} × ${task.num} = ${stepOne} × ${task.num} = ${answerValue}`;
    }

    cell.innerHTML = `
      <div class="task2-expression-row">
        <span class="task2-label">${task.label}</span>
        <div class="fraction-box">
          <span class="numerator">${task.num}</span>
          <span class="denominator">${task.den}</span>
        </div>
        <div class="task2-text">
          <span>${task.unit} от числа ${task.total} = </span>
          ${answerHtml}
        </div>
      </div>

      <div class="task2-cell-footer">
        <span class="task2-calc-hint" style="${task.showAnswer ? '' : 'display:none;'}">
          📝 ${calculationHint}
        </span>
        <button class="btn btn-sm btn-toggle-answer ${task.showAnswer ? 'active' : ''}" data-task-id="${task.id}" title="Показать или скрыть ответ">
          ${task.showAnswer ? '🙈 Скрыть' : `👁️ Ответ: ${answerValue}`}
        </button>
      </div>
    `;

    const ansBtn = cell.querySelector('.btn-toggle-answer');
    if (ansBtn) {
      ansBtn.addEventListener('click', () => this.toggleSection2Answer(task.id));
    }

    return cell;
  }

  // ==========================================================================
  // Отрисовка Задания 3: Текстовая задача на остаток множества
  // ==========================================================================
  renderSection3() {
    const t = this.task3;
    const card = this.taskCard3;

    // Вычисления
    const knownShareCount = t.total / t.den;
    const targetShareCount = t.total - knownShareCount;

    // Полоска долей множества (Tape diagram)
    const segmentsHtml = Array.from({ length: t.den }).map((_, i) => {
      const isKnown = i < t.num;
      const cls = isKnown ? 'known-part' : 'target-part';
      const label = t.showAnswer ? `${knownShareCount}` : `?`;
      return `<div class="tape-segment ${cls}">${label}</div>`;
    }).join('');

    let answerHtml = '';
    if (t.showAnswer) {
      answerHtml = `<span class="task-answer-display revealed">${targetShareCount} ${t.itemName}</span>`;
    } else {
      answerHtml = `<span class="task-answer-display hidden-answer">?</span>`;
    }

    let solutionHtml = '';
    if (t.showSolution) {
      solutionHtml = `
        <div class="solution-breakdown">
          <h4>💡 Пошаговое решение задачи:</h4>
          <div class="solution-step">
            <span class="step-num">1</span>
            <span><strong>Находим часть предметов (${t.knownPartLabel}):</strong><br>
            ${t.total} ÷ ${t.den} = <strong>${knownShareCount}</strong> (${t.itemName}).</span>
          </div>
          <div class="solution-step">
            <span class="step-num">2</span>
            <span><strong>Находим оставшуюся часть (${t.targetPartLabel}):</strong><br>
            ${t.total} - ${knownShareCount} = <strong>${targetShareCount}</strong> (${t.itemName}).<br>
            <em>(Или через доли: 1 - <sup>${t.num}</sup>&frasl;<sub>${t.den}</sub> = <sup>${t.den - t.num}</sup>&frasl;<sub>${t.den}</sub>, тогда ${knownShareCount} × ${t.den - t.num} = ${targetShareCount}).</em></span>
          </div>
          <div style="margin-top:8px; font-weight:800; color:#15803d;">
            Ответ: ${targetShareCount} ${t.itemName}.
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="word-task-header">
        <div class="word-task-badge">${t.badge}</div>
        <div class="word-task-text">
          ${t.character} ${t.total} ${t.itemName}. Из них 
          <span class="fraction-box">
            <span class="numerator">${t.num}</span>
            <span class="denominator">${t.den}</span>
          </span> 
          часть — ${t.knownPartLabel}, а остальные — ${t.targetPartLabel}.
          <br><strong>${t.question}</strong>
        </div>
      </div>

      <!-- Наглядная полоска долей множества -->
      <div class="tape-diagram-wrap">
        <div class="tape-diagram-label">
          <span>📊 Схема долей множества (всего ${t.total} ${t.itemName}):</span>
        </div>
        <div class="tape-bar">
          ${segmentsHtml}
        </div>
        <div class="tape-legend">
          <div class="tape-legend-item">
            <span class="legend-color-dot" style="background:#ffedd5;"></span>
            <span>${t.knownPartLabel}: <sup>${t.num}</sup>&frasl;<sub>${t.den}</sub> (${t.showAnswer ? knownShareCount : '?'})</span>
          </div>
          <div class="tape-legend-item">
            <span class="legend-color-dot" style="background:#e0f2fe;"></span>
            <span>${t.targetPartLabel}: <sup>${t.den - t.num}</sup>&frasl;<sub>${t.den}</sub> (искомое: ${t.showAnswer ? targetShareCount : '?'})</span>
          </div>
        </div>
      </div>

      <div class="student-write-lines">
        <div class="student-write-line">Решение 1) ____________________________________</div>
        <div class="student-write-line">Решение 2) ____________________________________</div>
        <div class="student-write-line">Ответ: _________________________________________</div>
      </div>

      <div class="word-task-footer">
        <div class="word-task-answer-wrap">
          <span style="font-size:16px; font-weight:700;">Ответ:</span>
          ${answerHtml}
        </div>
        <div class="teacher-item-actions">
          <button class="btn btn-sm btn-toggle-answer ${t.showAnswer ? 'active' : ''}" id="btnToggleT3">
            ${t.showAnswer ? '🙈 Скрыть ответ' : `👁️ Ответ: ${targetShareCount}`}
          </button>
        </div>
      </div>

      ${solutionHtml}
    `;

    const btn = card.querySelector('#btnToggleT3');
    if (btn) btn.addEventListener('click', () => this.toggleTask3Answer());
  }

  // ==========================================================================
  // Отрисовка Задания 4: Текстовая задача на нахождение целого по его дроби
  // ==========================================================================
  renderSection4() {
    const t = this.task4;
    const card = this.taskCard4;

    // 1 доля = knownCount / num
    const oneShareCount = Math.round(t.knownCount / t.num);
    const totalCount = oneShareCount * t.den;

    // Полоска долей
    const segmentsHtml = Array.from({ length: t.den }).map((_, i) => {
      const isKnown = i < t.num;
      const cls = isKnown ? 'known-part' : 'target-part';
      const label = t.showAnswer ? `${oneShareCount}` : `?`;
      return `<div class="tape-segment ${cls}">${label}</div>`;
    }).join('');

    let answerHtml = '';
    if (t.showAnswer) {
      answerHtml = `<span class="task-answer-display revealed">${totalCount} ${t.itemTotalName}</span>`;
    } else {
      answerHtml = `<span class="task-answer-display hidden-answer">?</span>`;
    }

    let solutionHtml = '';
    if (t.showSolution) {
      solutionHtml = `
        <div class="solution-breakdown">
          <h4>💡 Пошаговое решение задачи (нахождение числа по его дроби):</h4>
          <div class="solution-step">
            <span class="step-num">1</span>
            <span><strong>Находим, сколько составляет 1 доля (<sup>1</sup>&frasl;<sub>${t.den}</sub>):</strong><br>
            Так как ${t.num} долей — это ${t.knownCount} шт, делим известное число на числитель:<br>
            ${t.knownCount} ÷ ${t.num} = <strong>${oneShareCount}</strong> (${t.itemTotalName} в одной доле).</span>
          </div>
          <div class="solution-step">
            <span class="step-num">2</span>
            <span><strong>Находим общее число (все ${t.den} долей множества):</strong><br>
            Умножаем размер одной доли на знаменатель:<br>
            ${oneShareCount} × ${t.den} = <strong>${totalCount}</strong> (${t.itemTotalName} всего).</span>
          </div>
          <div style="margin-top:8px; font-weight:800; color:#15803d;">
            Ответ: всего ${totalCount} ${t.itemTotalName}.
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="word-task-header">
        <div class="word-task-badge">${t.badge}</div>
        <div class="word-task-text">
          ${t.character} ${t.action}. 
          <span class="fraction-box">
            <span class="numerator">${t.num}</span>
            <span class="denominator">${t.den}</span>
          </span> 
          части всего множества — ${t.knownPartLabel}, а остальная часть — ${t.otherPartLabel}.
          <br><strong>${t.question}</strong>
        </div>
      </div>

      <!-- Полоска долей -->
      <div class="tape-diagram-wrap">
        <div class="tape-diagram-label">
          <span>📊 Схема: нахождение целого множества по известной части:</span>
        </div>
        <div class="tape-bar">
          ${segmentsHtml}
        </div>
        <div class="tape-legend">
          <div class="tape-legend-item">
            <span class="legend-color-dot" style="background:#ffedd5;"></span>
            <span>Известная часть (${t.knownPartLabel}): <sup>${t.num}</sup>&frasl;<sub>${t.den}</sub> = ${t.knownCount} шт (${t.showAnswer ? `по ${oneShareCount} в доле` : '?'})</span>
          </div>
          <div class="tape-legend-item">
            <span class="legend-color-dot" style="background:#e0f2fe;"></span>
            <span>Остальная часть (${t.otherPartLabel}): <sup>${t.den - t.num}</sup>&frasl;<sub>${t.den}</sub></span>
          </div>
          <div class="tape-legend-item">
            <span style="color:#0f172a; font-weight:800;">Всего (целое множество): ${t.showAnswer ? totalCount : '?'}</span>
          </div>
        </div>
      </div>

      <div class="student-write-lines">
        <div class="student-write-line">Решение 1) ____________________________________</div>
        <div class="student-write-line">Решение 2) ____________________________________</div>
        <div class="student-write-line">Ответ: _________________________________________</div>
      </div>

      <div class="word-task-footer">
        <div class="word-task-answer-wrap">
          <span style="font-size:16px; font-weight:700;">Ответ:</span>
          ${answerHtml}
        </div>
        <div class="teacher-item-actions">
          <button class="btn btn-sm btn-toggle-answer ${t.showAnswer ? 'active' : ''}" id="btnToggleT4">
            ${t.showAnswer ? '🙈 Скрыть ответ' : `👁️ Ответ: ${totalCount}`}
          </button>
        </div>
      </div>

      ${solutionHtml}
    `;

    const btn = card.querySelector('#btnToggleT4');
    if (btn) btn.addEventListener('click', () => this.toggleTask4Answer());
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  window.teacherApp = new TeacherDeskApp();
});
