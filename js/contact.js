document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.style.cssText = `
        border: 8px solid #f3f3f3; /* Light grey */
        border-top: 8px solid #FF6600; /* Orange */
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 0.5s linear infinite;
        display: none; /* Initially hidden */
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000; /* Ensure it appears above other content */
    `;
    document.body.appendChild(spinner);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        formData.append('action', 'contact');
        await sendData(formData);
    });

    async function sendData(formData) {
        // Show spinner before making the request
        spinner.style.display = 'block';
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyjPB7eHerAWOz_yk4rbzvdjITht1uvfao-k2WAF3txvUKva34xReqZ4MQAH_WNcbvk/exec', { // Replace with your Google Apps Script URL
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            showModal(result);
        } catch (error) {
            console.error('Error:', error);
            showModal({ success: false, message: "An error occurred." });
        } finally {
            // Hide spinner after the request is complete
            spinner.style.display = 'none';
        }
    }

    function showModal(result) {
        const modalContent = `
            <div class="modal" id="responseModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${result.success ? 'Success' : 'Failure'}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal()">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${result.message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn" style="background-color: #FF6600; color: white;" onclick="closeModal()">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);
        document.getElementById('responseModal').style.display = 'block';
    }

    window.closeModal = function() {
        const modal = document.getElementById('responseModal');
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    };
});