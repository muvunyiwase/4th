// Supabase config
const SUPABASE_URL = 'https://whdaocuukovxtgplzxtw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Xz9mTsZP152uve0MogY-9w_LhB2nVD4';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

$(document).ready(function () {

    $('#contactForm').on('submit', async function (e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();

        if (!name || !email || !message) {
            showAlert('Please fill in Name, Email, and Message.', 'danger');
            return;
        }

        const services = [];
        if ($('#inlineCheckbox1').is(':checked')) services.push('Websites');
        if ($('#inlineCheckbox2').is(':checked')) services.push('Branding');
        if ($('#inlineCheckbox3').is(':checked')) services.push('Ecommerce');
        if ($('#inlineCheckbox4').is(':checked')) services.push('Database Administrator');

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.text('Sending...').prop('disabled', true);

        const { error } = await db.from('contacts').insert([{ name, email, services, message }]);

        submitBtn.text('Send').prop('disabled', false);

        if (error) {
            showAlert('Failed to send message. Please try again.', 'danger');
            console.error(error);
        } else {
            showAlert('Message sent successfully!', 'success');
            $('#contactForm')[0].reset();
        }
    });

    function showAlert(message, type) {
        $('.alert').remove();
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
        $('#contactForm').before(alertHtml);
        if (type === 'success') setTimeout(() => $('.alert-success').alert('close'), 5000);
    }
});
