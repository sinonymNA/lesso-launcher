document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addLessonButton').addEventListener('click', function() {
        const lessonType = prompt("Enter the type of lesson content (icebreaker, video, slideshow, assessment):");
        if (!lessonType) return; // Exit if no input is given
        addLesson(lessonType.toLowerCase());
    });

    document.getElementById('generateLessonPlanButton').addEventListener('click', function() {
        const topic = document.getElementById('lesson-topic').value;
        const standards = document.getElementById('lesson-standards').value;
        generateLessonPlan(topic, standards);
    });
});

function addLesson(lessonType) {
    const container = document.getElementById('lessonContainer');
    const newLesson = document.createElement('div');
    newLesson.className = 'p-4 border-t border-gray-300';
    newLesson.innerHTML = `
        <h2 class="text-lg font-bold">${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}</h2>
        <input type="text" id="${lessonType}-topic" placeholder="Enter the topic here (optional)" class="mb-2 mt-2 p-2 border rounded w-full">
        <input type="text" id="${lessonType}-standards" placeholder="Enter the state standards here (optional)" class="mb-2 p-2 border rounded w-full">
        <p id="${lessonType}-content">Click generate to create content.</p>
        <button onclick="generateContent('${lessonType}')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate ${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)}</button>
    `;
    container.appendChild(newLesson);
}

async function generateContent(type) {
    const topicInput = document.getElementById(`${type}-topic`).value;
    const standardsInput = document.getElementById(`${type}-standards`).value;
    let prompt;

    switch (type) {
        case 'icebreaker':
            prompt = `Create an engaging icebreaker activity for a lesson about ${topicInput || 'a topic'} that aligns with the following state standards: ${standardsInput || 'N/A'}. The question should be thought-provoking and relevant to the topic.`;
            break;
        case 'video':
            prompt = `Suggest a high-quality video resource that is less than 10 minutes long for a lesson about ${topicInput || 'a topic'} that aligns with the following state standards: ${standardsInput || 'N/A'}. The video should be informative and suitable for students.`;
            break;
        case 'slideshow':
            prompt = `Outline a comprehensive slideshow presentation for a lesson about ${topicInput || 'a topic'} that aligns with the following state standards: ${standardsInput || 'N/A'}. The presentation should cover key points and be engaging for students.`;
            break;
        case 'assessment':
            prompt = `Generate an assessment with 5 multiple choice questions and answers for a lesson about ${topicInput || 'a topic'} that aligns with the following state standards: ${standardsInput || 'N/A'}. The assessment should test students' understanding of the topic.`;
            break;
        default:
            prompt = `Generate educational content for a lesson about ${topicInput || 'a topic'} that aligns with the following state standards: ${standardsInput || 'N/A'}.`;
    }

    console.log('Sending request with prompt:', prompt);  // Debugging log

    try {
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });
        const data = await response.json();
        console.log('Received response:', data);  // Debugging log
        if (data.text) {
            document.getElementById(`${type}-content`).innerText = data.text;
        } else {
            document.getElementById(`${type}-content`).innerText = 'Error generating content. Please try again.';
        }
    } catch (error) {
        console.error('Failed to generate content:', error);
        document.getElementById(`${type}-content`).innerText = 'Error generating content. Please try again.';
    }
}

async function generateLessonPlan(topic, standards) {
    const lessonTypes = ['icebreaker', 'video', 'slideshow', 'assessment'];
    for (const type of lessonTypes) {
        const container = document.getElementById('lessonContainer');
        const newLesson = document.createElement('div');
        newLesson.className = 'p-4 border-t border-gray-300';
        newLesson.innerHTML = `
            <h2 class="text-lg font-bold">${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <input type="text" id="${type}-topic" value="${topic || ''}" class="mb-2 mt-2 p-2 border rounded w-full" placeholder="Topic (optional)" readonly>
            <input type="text" id="${type}-standards" value="${standards || ''}" class="mb-2 p-2 border rounded w-full" placeholder="State standards (optional)" readonly>
            <p id="${type}-content">Generating content...</p>
        `;
        container.appendChild(newLesson);

        let prompt;
        switch (type) {
            case 'icebreaker':
                prompt = `Create an engaging icebreaker activity for a lesson about ${topic || 'a topic'} that aligns with the following state standards: ${standards || 'N/A'}. The activity should take between 5-10 minutes and assume that the student doesn't know anything.`;
                break;
            case 'video':
                prompt = `Suggest 3 high-quality video resources that are less than 10 minutes long for a lesson about ${topic || 'a topic'} that align with the following state standards: ${standards || 'N/A'}. Provide a link for the video.`;
                break;
            case 'slideshow':
                prompt = `Create a 10-slide slideshow presentation for a lesson about ${topic || 'a topic'} that aligns with the following state standards: ${standards || 'N/A'}.`;
                break;
            case 'assessment':
                prompt = `Generate an assessment with 5 multiple choice questions and 1 open question and answers for a lesson about ${topic || 'a topic'} that aligns with the following state standards: ${standards || 'N/A'}. The assessment should test students' understanding of the topic.`;
                break;
        }

        console.log('Sending request with prompt:', prompt);  // Debugging log

        try {
            const response = await fetch('http://localhost:5000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            });
            const data = await response.json();
            console.log('Received response:', data);  // Debugging log
            if (data.text) {
                document.getElementById(`${type}-content`).innerText = data.text;
            } else {
                document.getElementById(`${type}-content`).innerText = 'Error generating content. Please try again.';
            }
        } catch (error) {
            console.error('Failed to generate content:', error);
            document.getElementById(`${type}-content`).innerText = 'Error generating content. Please try again.';
        }
    }
}

function exportLessons() {
    const lessons = document.querySelectorAll('#lessonContainer > div');
    const exportData = Array.from(lessons).map(lesson => {
        return {
            type: lesson.querySelector('h2').innerText,
            topic: lesson.querySelector('input').value,
            standards: lesson.querySelector('input[type="text"]').value,
            content: lesson.querySelector('p').innerText
        };
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    exportData.forEach((lesson, index) => {
        if (index > 0) doc.addPage();
        doc.setFontSize(16);
        doc.text(lesson.type, 10, 10);
        doc.setFontSize(12);
        doc.text(`Topic: ${lesson.topic}`, 10, 20);
        doc.text(`Standards: ${lesson.standards}`, 10, 30);
        doc.text(`Content: ${lesson.content}`, 10, 40, { maxWidth: 180 });
    });

    doc.save('lessonPlan.pdf');
}
