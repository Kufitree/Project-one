document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const habitInput = document.getElementById('habit-input');
    const addBtn = document.getElementById('add-btn');
    const habitList = document.getElementById('habit-list');
    const emptyState = document.getElementById('empty-state');
    const totalHabitsEl = document.getElementById('total-habits');
    const completedTodayEl = document.getElementById('completed-today');

    // State
    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Functions
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
        updateStats();
        renderHabits();
    }

    function updateStats() {
        const total = habits.length;
        const completed = habits.filter(h => isCompletedToday(h)).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        totalHabitsEl.textContent = total;
        completedTodayEl.textContent = `${percentage}%`;
    }

    function isCompletedToday(habit) {
        const today = new Date().toDateString();
        return habit.completedDays.includes(today);
    }

    function createHabit(text) {
        const newHabit = {
            id: Date.now().toString(),
            text: text,
            createdAt: new Date().toISOString(),
            completedDays: []
        };
        habits.push(newHabit);
        saveHabits();
        habitInput.value = '';
    }

    function toggleHabit(id) {
        const habit = habits.find(h => h.id === id);
        if (habit) {
            const today = new Date().toDateString();
            const index = habit.completedDays.indexOf(today);
            
            if (index === -1) {
                habit.completedDays.push(today);
            } else {
                habit.completedDays.splice(index, 1);
            }
            saveHabits();
        }
    }

    function deleteHabit(id) {
        if (confirm('Are you sure you want to delete this habit?')) {
            habits = habits.filter(h => h.id !== id);
            saveHabits();
        }
    }

    function renderHabits() {
        habitList.innerHTML = '';
        
        if (habits.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
            
            habits.forEach(habit => {
                const isCompleted = isCompletedToday(habit);
                const li = document.createElement('li');
                li.className = `habit-item ${isCompleted ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <div class="habit-content">
                        <div class="checkbox-wrapper" onclick="window.toggleHabit('${habit.id}')">
                            <div class="custom-checkbox">
                                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                        <span class="habit-text">${habit.text}</span>
                    </div>
                    <button class="delete-btn" onclick="window.deleteHabit('${habit.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
                habitList.appendChild(li);
            });
        }
    }

    // Expose functions to window for inline onclick handlers
    window.toggleHabit = toggleHabit;
    window.deleteHabit = deleteHabit;

    // Event Listeners
    addBtn.addEventListener('click', () => {
        const text = habitInput.value.trim();
        if (text) {
            createHabit(text);
        }
    });

    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = habitInput.value.trim();
            if (text) {
                createHabit(text);
            }
        }
    });

    // Initial Render
    updateStats();
    renderHabits();
});
