// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB3tjY2lgwyliGliWAfiZLbYCWbZkMVBlw",
    authDomain: "studentregistration-3b935.firebaseapp.com",
    projectId: "studentregistration-3b935",
    storageBucket: "studentregistration-3b935.appspot.com",
    messagingSenderId: "982207750005",
    appId: "1:982207750005:web:ee8a0f187443f951583d3c",
    measurementId: "G-LC5CRDRHXZ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const userRef = database.ref('users/' + uid);

    userRef.once('value').then(snapshot => {
        const userData = snapshot.val();
        document.getElementById('user_name').textContent = userData.full_name;

        const companiesComing = [
            "Google", "Facebook", "Amazon", "Netflix", "Apple", "Microsoft", "IBM", "Oracle", 
            "Salesforce", "Adobe", "Intel", "Cisco", "SAP", "VMware", "PayPal", "Airbnb", 
            "Spotify", "Twitter", "LinkedIn", "Uber", "Lyft", "Snap", "Pinterest", "Dropbox", 
            "Slack", "Square", "Reddit",
        ];
        
        const companiesList = document.getElementById('companies_list');
        companiesComing.forEach(company => {
            const li = document.createElement('li');
            li.textContent = company;
            companiesList.appendChild(li);
        });

        const languagesKnown = userData.languages_known;
        const allCompanies = {
            "Java": [
                "INFOSYS", "CNS", "ACCENTURE", "TCS", "CAPGEMINI",
                "DELOITTE", "IBM", "TECH MAHINDRA", "LTI", "MINDTREE"
            ],
            "C": [
                "WIPRO", "PEOPLES GROUP", "HCL", "COGNIZANT", "HEXAWARE",
                "SONATA SOFTWARE", "ZENSAR TECHNOLOGIES", "MPHASIS", "NIIT", "KPIT"
            ],
            "Python": [
                "TATA GROUP", "ADITYA BIRLA", "INFOEDGE", "L&T INFOTECH", "SAPIENT",
                "ORACLE", "SAP", "YASH TECHNOLOGIES", "CYIENT", "NEWGEN SOFTWARE"
            ],
            "C++": [
                "SONY", "HP", "QUALCOMM", "MICROCHIP", "NVIDIA",
                "AMD", "BROADCOM", "INTEL", "HONEYWELL", "ARM"
            ],
            "JavaScript": [
                "GOOGLE", "MICROSOFT", "FACEBOOK", "TWITTER", "NETFLIX",
                "AMAZON", "EBAY", "UBER", "AIRBNB", "LINKEDIN"
            ],
            "PHP": [
                "FACEBOOK", "TWITTER", "WIKIMEDIA", "SLACK", "MAILCHIMP",
                "TESLA", "SPOTIFY", "DROPBOX", "ZENDESK", "HUBSPOT"
            ],
            "Swift": [
                "APPLE", "SAMSUNG", "IBM", "INTEL", "MICROSOFT",
                "ADOBE", "DELL", "CISCO", "QUALCOMM", "SAP"
            ],
            "Kotlin": [
                "GOOGLE", "MICROSOFT", "TWITTER", "INSTAGRAM", "LINKEDIN",
                "PINTEREST", "SPOTIFY", "TINDER", "UBER", "EVERNOTE"
            ],
            "C#": [
                "MICROSOFT", "GOOGLE", "FACEBOOK", "AMAZON", "IBM",
                "DELOITTE", "ACCENTURE", "TCS", "CAPGEMINI", "LTI"
            ],
            "Ruby": [
                "GITHUB", "GITLAB", "TWITTER", "SLACK", "SHOPIFY",
                "ZENDESK", "AIRBNB", "BASECAMP", "COOKPAD", "EVERNOTE"
            ],
            "Go": [
                "GOOGLE", "UBER", "TRELLO", "DOCKER", "CLOUDERA",
                "HEROKU", "SENDGRID", "GITLAB", "INFLUXDATA", "SOUNDCLOUD"
            ],
            
            
            "TypeScript": [
                "MICROSOFT", "GOOGLE", "FACEBOOK", "AMAZON", "UBER",
                "AIRBNB", "TWITTER", "SPOTIFY", "NETFLIX", "SLACK"
            ],
            "SQL": [
                "ORACLE", "MICROSOFT", "IBM", "SAP", "AMAZON",
                "FACEBOOK", "GOOGLE", "HCL", "TCS", "WIPRO"
            ],
            "NoSQL": [
                "MONGODB", "COUCHBASE", "REDIS LABS", "ELASTICSEARCH", "AMAZON",
                "GOOGLE", "FACEBOOK", "CASSANDRA", "DYNAMODB", "CLOUDANT"
            ],
            "HTML": [
                "GOOGLE", "FACEBOOK", "AMAZON", "NETFLIX", "TWITTER",
                "LINKEDIN", "MICROSOFT", "APPLE", "AIRBNB", "UBER"
            ],
            "CSS": [
                "GOOGLE", "FACEBOOK", "AMAZON", "NETFLIX", "TWITTER",
                "LINKEDIN", "MICROSOFT", "APPLE", "AIRBNB", "UBER"
            ],
           
            "Angular": [
                "GOOGLE", "TWITTER", "LINKEDIN", "NETFLIX", "SPOTIFY",
                "GITHUB", "GITLAB", "SLACK", "DROPBOX", "AIRBNB"
            ],
            "React": [
                "FACEBOOK", "GOOGLE", "TWITTER", "LINKEDIN", "NETFLIX",
                "SPOTIFY", "GITHUB", "GITLAB", "SLACK", "DROPBOX"
            ],
            "Node.js": [
                "GOOGLE", "FACEBOOK", "TWITTER", "LINKEDIN", "NETFLIX",
                "SPOTIFY", "GITHUB", "GITLAB", "SLACK", "DROPBOX"
            ],
            "Django": [
                "INSTAGRAM", "DISQUS", "NASA", "BITBUCKET", "MOZILLA",
                "NATIONAL GEOGRAPHIC", "EVENTBRITE", "SPOTIFY", "DROPBOX", "RED HAT"
           ],
        };
        
        const recommendedCompanies = [];
        languagesKnown.forEach(language => {
            if (allCompanies[language]) {
                allCompanies[language].forEach(company => {
                    if (!recommendedCompanies.includes(company)) {
                        recommendedCompanies.push(company);
                    }
                });
            }
        });
        const recommendedCompaniesList = document.getElementById('recommended_companies_list');
        recommendedCompanies.slice(0, 6).forEach(company => {
            const li = document.createElement('li');
            li.textContent = company;
            recommendedCompaniesList.appendChild(li);
        });

        // Add photo column
        const photoColumn = document.getElementById('photo_column');
        const photoUploadInput = document.createElement('input');
        photoUploadInput.type = 'file';
        photoUploadInput.id = 'photo_upload';
        photoColumn.appendChild(photoUploadInput);

        const uploadPhotoButton = document.createElement('button');
        uploadPhotoButton.textContent = 'Upload Photo';
        uploadPhotoButton.onclick = uploadPhoto;
        photoColumn.appendChild(uploadPhotoButton);

        // Display user photo on login
        const userPhotoRef = storage.ref('photos/' + uid + '.jpg');
        userPhotoRef.getDownloadURL().then(url => {
            document.getElementById('user_photo').src = url;
        });
    });
};

function uploadResume() {
    const file = document.getElementById('resume_upload').files[0];
    const uid = new URLSearchParams(window.location.search).get('uid');
    const storageRef = storage.ref();
    const userResumeRef = storageRef.child('resumes/' + uid + '.pdf');

    userResumeRef.put(file).then(() => {
        alert('Resume uploaded successfully!');
    }).catch(error => {
        console.error('Error uploading resume:', error);
        alert('Failed to upload resume. Please try again.');
    });
}

function viewPlacementsMaterial() {
    // Redirect to placements material HTML URL
    window.location.href = 'https://drive.google.com/drive/folders/1SkCOcAS0Kqvuz-MJkkjbFr1GSue6Ms6m';
}

function viewAptitude() {
    window.location.href = 'https://telegram.me/s/placement_material?before=259';

    alert('Viewing aptitude material...');
}

function uploadPhoto() {
    const file = document.getElementById('photo_upload').files[0];
    const uid = new URLSearchParams(window.location.search).get('uid');
    const storageRef = storage.ref();
    const userPhotoRef = storageRef.child('photos/' + uid + '.jpg');

    userPhotoRef.put(file).then(() => {
        alert('Photo uploaded successfully!');
        userPhotoRef.getDownloadURL().then(url => {
            document.getElementById('user_photo').src = url;
        });
    }).catch(error => {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
    });

}
function uploadPhoto() {
    const file = document.getElementById('photo_upload').files[0];
    const uid = new URLSearchParams(window.location.search).get('uid');
    const storageRef = storage.ref();
    const userPhotoRef = storageRef.child('photos/' + uid + '.jpg');

    userPhotoRef.put(file).then(() => {
        alert('Photo uploaded successfully!');
        userPhotoRef.getDownloadURL().then(url => {
            document.getElementById('profile-picture').src = url;
        });
    }).catch(error => {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
    });
}
userRef.once('value').then(snapshot => {
    const userData = snapshot.val();
    document.getElementById('user_name').textContent = userData.full_name;
    const userPhotoRef = storageRef.child('photos/' + uid + '.jpg');
    userPhotoRef.getDownloadURL().then(url => {
        document.getElementById('user_photo').src = url;
    });
});
