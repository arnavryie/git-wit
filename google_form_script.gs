/**
 * GitWit — School & College Visit / Field Workshop Google Form Generator
 * 
 * Instructions to generate this form in your Google Drive:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Paste this code into Code.gs
 * 4. Click "Run" (Grant standard Google permissions when prompted)
 * 5. Check the Execution Log for your live Google Form Edit & Public links!
 */

function createGitWitVisitGoogleForm() {
  var form = FormApp.create('⚔️ GitWit — Campus Visit & Workshop');
  
  form.setDescription(
    'Welcome to GitWit!\n' +
    'The social intelligence platform for open-source developers — GitHub meets smart developer discovery.\n\n' +
    'Please fill out this 2-minute form to unlock early beta access, workshop resources, and your AI Developer Dossier.'
  );
  
  // Section 1: Basic Information
  form.addSectionHeaderItem().setTitle('Section 1: Basic Information');
  
  form.addTextItem().setTitle('Full Name').setRequired(true);
  form.addTextItem().setTitle('Email Address').setRequired(true);
  form.addTextItem().setTitle('Phone / WhatsApp Number (Optional)').setRequired(false);
  
  var institutionType = form.addMultipleChoiceItem();
  institutionType.setTitle('Are you attending School or College?')
    .setChoiceValues([
      'School (Grade 9–12)',
      'College / University (Undergraduate)',
      'College / University (Postgraduate)',
      'Faculty / Teacher / Mentor',
      'Other'
    ])
    .setRequired(true);
    
  form.addTextItem().setTitle('School / College / University Name').setRequired(true);
  form.addTextItem().setTitle('Department / Stream & Year (e.g., CSE 2nd Year, 11th Grade Science)').setRequired(true);

  // Section 2: Developer & Tech Profile
  form.addSectionHeaderItem().setTitle('Section 2: Coding & Tech Interests');
  
  form.addTextItem().setTitle('GitHub Username (Optional - leave blank if you do not have one)').setRequired(false);
  
  var experience = form.addMultipleChoiceItem();
  experience.setTitle('What is your current coding experience level?')
    .setChoiceValues([
      'Beginner / Just starting out',
      'Intermediate (Built a few personal/school projects)',
      'Advanced (Active open-source contributor / developer)',
      'Non-coder / Curious learner'
    ])
    .setRequired(true);
    
  var techStack = form.addCheckboxItem();
  techStack.setTitle('Which technologies / languages are you interested in or currently learning?')
    .setChoiceValues([
      'Python',
      'JavaScript / TypeScript',
      'Web Development (React / Next.js / HTML & CSS)',
      'AI / Machine Learning / Data Science',
      'Mobile App Development (Flutter / React Native)',
      'C / C++ / Java',
      'Cloud & DevOps (Docker, Google Cloud, AWS)',
      'Cybersecurity & Networking'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Section 3: Feedback & GitWit Features
  form.addSectionHeaderItem().setTitle('Section 3: Session Feedback & GitWit Features');
  
  var rating = form.addScaleItem();
  rating.setTitle('How would you rate today\'s GitWit presentation / field visit?')
    .setBounds(1, 5)
    .setLabels('1 (Needs Improvement)', '5 (Super Inspiring!)')
    .setRequired(true);

  var favoriteFeatures = form.addCheckboxItem();
  favoriteFeatures.setTitle('Which GitWit features did you find most exciting?')
    .setChoiceValues([
      'Personalized "For You" Feed (trending repos matched to your language stack)',
      'Gemini AI Repo Insights & Summaries',
      'AI Developer Dossier / Sharable Profile Card',
      'MongoDB Atlas Semantic Skill Matching',
      'Developer Communities & Social Feed'
    ])
    .showOtherOption(true);

  // Section 4: Next Steps & Community
  form.addSectionHeaderItem().setTitle('Section 4: Next Steps & Community');
  
  var nextSteps = form.addCheckboxItem();
  nextSteps.setTitle('What would you like to receive / participate in?')
    .setChoiceValues([
      'Get early beta access to GitWit',
      'Receive workshop slides, curated GitHub starter repos, and cheat sheets',
      'Apply as a GitWit Campus Ambassador / Student Lead',
      'Join the GitWit Discord & Developer Community'
    ]);

  form.addParagraphTextItem().setTitle('Any suggestions, questions, or ideas for GitWit?').setRequired(false);

  // Print Links
  Logger.log('====================================================');
  Logger.log('🎉 Form Created Successfully!');
  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Public Response URL (Share with students): ' + form.getPublishedUrl());
  Logger.log('====================================================');
}
