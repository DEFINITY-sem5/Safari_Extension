function check_title(title) {
    title = title.toString().replace(/\s+/g, ' ').trim();
    var title_display = document.getElementById("title-display");

    title_display.innerHTML = title.toString();
}

function extract_hostname(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
}

document.addEventListener('DOMContentLoaded', function () {
    this.clickbait_display = document.getElementById('clickbait-display');
    chrome.tabs.query({
        active: true
    }, function (tabs) {

        var tab = tabs[0];
        var page_domain = extract_hostname(tab.url.toString());

        var title_display = document.getElementById("title-display");
        var domain_display = document.getElementById("domain-display");
        var clickbait_display = document.getElementById("clickbait-display");
        var profile_display = document.getElementById("profile-display");
        var subj_display = document.getElementById("subj-display");
        var debug_display = document.getElementById("debug-display");

        var clickbait_prompt = document.getElementById("clickbait-prompt");
        var profile_prompt = document.getElementById("profile-prompt");

        var claimReview_display = document.getElementById("claimReviewDisplay");

        domain_display.innerHTML = page_domain;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://35.185.181.66:5000/predict?article_url=' + tab.url.toString(), true);
        xhr.onload = function () {
            var json = JSON.parse(this.responseText);
            debug_display.innerHTML = this.responseText;

            title_display.innerHTML = json.article_title;


            


            // clickbait
            clickbait_display.innerHTML = json.clickbait;
            if (json.clickbait == "clickbait") {
                clickbait_prompt.innerHTML = "Headline appears to be written to attract more views"
                try {
                    clickbait_display.classList.remove("badge-success");
                } catch (err) {
                    console.log(err)
                } finally {
                    clickbait_display.classList.add("badge-danger");
                }
            } else {
                clickbait_prompt.innerHTML = "Headline does not appear to sensationalise the news"
                try {
                    clickbait_display.classList.remove("badge-danger");
                } catch (err) {
                    console.log(err)
                } finally {
                    clickbait_display.classList.add("badge-success");
                }
            }



        };
        xhr.send();
    });

});