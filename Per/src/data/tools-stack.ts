export interface StackTool {
  name: string;
  slug?: string;
  devicon?: string;
  color?: string;
}

export interface ToolCategory {
  id: string;
  label: string;
  emoji?: string;
  tools: StackTool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'ai-ml',
    label: 'AI & Machine Learning',
    emoji: '🤖',
    tools: [
      { name: 'OpenAI GPT', slug: 'openai', color: '412991' },
      { name: 'Claude', slug: 'anthropic', color: '191919' },
      { name: 'Gemini', slug: 'google', color: '4285F4' },
      { name: 'Meta Llama', slug: 'meta', color: '0467DF' },
      { name: 'Hugging Face', slug: 'huggingface', color: 'FFD21E' },
      { name: 'LangChain', slug: 'langchain', color: '1C3C3C' },
      { name: 'LangGraph', slug: 'langchain', color: '6366F1' },
      { name: 'CrewAI', devicon: 'python/python-original', color: '8B5CF6' },
      { name: 'AutoGen', slug: 'microsoft', color: '0078D4' },
      { name: 'TensorFlow', slug: 'tensorflow', color: 'FF6F00' },
      { name: 'PyTorch', slug: 'pytorch', color: 'EE4C2C' },
      { name: 'Scikit-learn', slug: 'scikitlearn', color: 'F7931E' },
      { name: 'Keras', slug: 'keras', color: 'D00000' },
      { name: 'OpenCV', slug: 'opencv', color: '5C3EE8' },
      { name: 'MediaPipe', slug: 'google', color: '4285F4' },
      { name: 'YOLO', slug: 'ultralytics', color: '00FFFF' },
      { name: 'Whisper', slug: 'openai', color: '10A37F' },
      { name: 'ElevenLabs', slug: 'elevenlabs', color: '000000' },
      { name: 'Pinecone', slug: 'pinecone', color: '000000' },
      { name: 'Weaviate', slug: 'weaviate', color: 'FA5252' },
      { name: 'ChromaDB', devicon: 'python/python-original', color: 'FF6B35' },
      { name: 'Milvus', devicon: 'python/python-original', color: '00A1EA' },
    ],
  },
  {
    id: 'automation',
    label: 'AI Automation & No-Code',
    emoji: '⚡',
    tools: [
      { name: 'n8n', slug: 'n8n', color: 'EA4B71' },
      { name: 'Make', slug: 'make', color: '6D00CC' },
      { name: 'Zapier', slug: 'zapier', color: 'FF4A00' },
      { name: 'Pipedream', slug: 'pipedream', color: '00C4FF' },
      { name: 'Activepieces', slug: 'activepieces', color: '6366F1' },
      { name: 'Power Automate', slug: 'microsoft', color: '0078D4' },
      { name: 'Airtable', slug: 'airtable', color: '18BFFF' },
      { name: 'Retool', slug: 'retool', color: '3D3D3D' },
      { name: 'Bubble', slug: 'bubble', color: '020202' },
      { name: 'Glide', slug: 'google', color: '18BFFF' },
      { name: 'Softr', slug: 'airtable', color: '6366F1' },
    ],
  },
  {
    id: 'languages',
    label: 'Programming Languages',
    emoji: '💻',
    tools: [
      { name: 'Python', slug: 'python', color: '3776AB' },
      { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
      { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
      { name: 'C++', slug: 'cplusplus', color: '00599C' },
      { name: 'Java', slug: 'java', color: '007396' },
      { name: 'PHP', slug: 'php', color: '777BB4' },
      { name: 'C#', slug: 'csharp', color: '512BD4' },
      { name: 'Go', slug: 'go', color: '00ADD8' },
      { name: 'Rust', slug: 'rust', color: '000000' },
      { name: 'SQL', slug: 'postgresql', color: '336791' },
      { name: 'HTML5', slug: 'html5', color: 'E34F26' },
      { name: 'CSS3', slug: 'css3', color: '1572B6' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend Development',
    emoji: '🌐',
    tools: [
      { name: 'React', slug: 'react', color: '61DAFB' },
      { name: 'Next.js', slug: 'nextdotjs', color: '000000' },
      { name: 'Vue.js', slug: 'vuedotjs', color: '4FC08D' },
      { name: 'Nuxt', slug: 'nuxtdotjs', color: '00DC82' },
      { name: 'Angular', slug: 'angular', color: 'DD0031' },
      { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
      { name: 'Bootstrap', slug: 'bootstrap', color: '7952B3' },
      { name: 'Material UI', slug: 'mui', color: '007FFF' },
      { name: 'Shadcn UI', slug: 'react', color: 'FFFFFF' },
      { name: 'Framer Motion', slug: 'framer', color: '0055FF' },
      { name: 'GSAP', devicon: 'javascript/javascript-original', color: '88CE02' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend Development',
    emoji: '⚙',
    tools: [
      { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
      { name: 'Express.js', slug: 'express', color: '000000' },
      { name: 'NestJS', slug: 'nestjs', color: 'E0234E' },
      { name: 'Django', slug: 'django', color: '092E20' },
      { name: 'FastAPI', slug: 'fastapi', color: '009688' },
      { name: 'Flask', slug: 'flask', color: '000000' },
      { name: 'Laravel', slug: 'laravel', color: 'FF2D20' },
      { name: 'Spring Boot', slug: 'spring', color: '6DB33F' },
      { name: 'ASP.NET', slug: 'dotnet', color: '512BD4' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Development',
    emoji: '📱',
    tools: [
      { name: 'Flutter', slug: 'flutter', color: '02569B' },
      { name: 'React Native', slug: 'react', color: '61DAFB' },
      { name: 'Kotlin', slug: 'kotlin', color: '7F52FF' },
      { name: 'Swift', slug: 'swift', color: 'F05138' },
      { name: 'Expo', slug: 'expo', color: '000020' },
      { name: 'Ionic', slug: 'ionic', color: '3880FF' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    emoji: '🗄',
    tools: [
      { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
      { name: 'MySQL', slug: 'mysql', color: '4479A1' },
      { name: 'MongoDB', slug: 'mongodb', color: '47A248' },
      { name: 'Firebase', slug: 'firebase', color: 'DD2C00' },
      { name: 'Supabase', slug: 'supabase', color: '3FCF8E' },
      { name: 'Redis', slug: 'redis', color: 'FF4438' },
      { name: 'SQLite', slug: 'sqlite', color: '003B57' },
      { name: 'SQL Server', slug: 'microsoftsqlserver', color: 'CC2927' },
      { name: 'Oracle', slug: 'oracle', color: 'F80000' },
    ],
  },
  {
    id: 'saas',
    label: 'SaaS & Product',
    emoji: '🚀',
    tools: [
      { name: 'Stripe', slug: 'stripe', color: '635BFF' },
      { name: 'Lemon Squeezy', slug: 'lemonsqueezy', color: 'FFC233' },
      { name: 'Paddle', slug: 'paddle', color: 'FFCC00' },
      { name: 'Clerk', slug: 'clerk', color: '6C47FF' },
      { name: 'Auth0', slug: 'auth0', color: 'EB5424' },
      { name: 'Supabase Auth', slug: 'supabase', color: '3FCF8E' },
      { name: 'Firebase Auth', slug: 'firebase', color: 'DD2C00' },
      { name: 'Prisma', slug: 'prisma', color: '2D3748' },
      { name: 'Drizzle ORM', devicon: 'typescript/typescript-original', color: 'C5F74F' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & BI',
    emoji: '📊',
    tools: [
      { name: 'Google Analytics', slug: 'googleanalytics', color: 'E37400' },
      { name: 'Looker Studio', slug: 'looker', color: '4285F4' },
      { name: 'Power BI', slug: 'powerbi', color: 'F2C811' },
      { name: 'Tableau', slug: 'tableau', color: 'E97627' },
      { name: 'Mixpanel', slug: 'mixpanel', color: '7856FF' },
      { name: 'PostHog', slug: 'posthog', color: '1D4AFF' },
      { name: 'Hotjar', slug: 'hotjar', color: 'FF3C00' },
      { name: 'Amplitude', slug: 'amplitude', color: '1F1F1F' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM & Business',
    emoji: '💼',
    tools: [
      { name: 'HubSpot', slug: 'hubspot', color: 'FF7A59' },
      { name: 'Salesforce', slug: 'salesforce', color: '00A1E0' },
      { name: 'Zoho CRM', slug: 'zoho', color: 'C8202B' },
      { name: 'Monday.com', slug: 'monday', color: 'FF3D57' },
      { name: 'ClickUp', slug: 'clickup', color: '7B68EE' },
      { name: 'Notion', slug: 'notion', color: '000000' },
      { name: 'Jira', slug: 'jira', color: '0052CC' },
      { name: 'Asana', slug: 'asana', color: 'F06A6A' },
      { name: 'Trello', slug: 'trello', color: '0052CC' },
    ],
  },
  {
    id: 'finance',
    label: 'Accounting & Finance',
    emoji: '💰',
    tools: [
      { name: 'QuickBooks', slug: 'quickbooks', color: '2CA01C' },
      { name: 'Xero', slug: 'xero', color: '13B5EA' },
      { name: 'Odoo', slug: 'odoo', color: '714B67' },
      { name: 'Zoho Books', slug: 'zoho', color: 'C8202B' },
      { name: 'FreshBooks', slug: 'freshbooks', color: '0075DD' },
      { name: 'Wave', slug: 'wave', color: '1C3B7A' },
      { name: 'SAP', slug: 'sap', color: '0FAAFF' },
      { name: 'NetSuite', slug: 'oracle', color: 'F80000' },
    ],
  },
  {
    id: 'creative',
    label: 'UI/UX & Creative',
    emoji: '🎨',
    tools: [
      { name: 'Figma', slug: 'figma', color: 'F24E1E' },
      { name: 'Photoshop', slug: 'adobephotoshop', color: '31A8FF' },
      { name: 'Illustrator', slug: 'adobeillustrator', color: 'FF9A00' },
      { name: 'Adobe XD', slug: 'adobexd', color: 'FF61F6' },
      { name: 'Canva', slug: 'canva', color: '00C4CC' },
      { name: 'Framer', slug: 'framer', color: '0055FF' },
      { name: 'Spline', devicon: 'threejs/threejs-original', color: '6366F1' },
      { name: 'Blender', slug: 'blender', color: 'E87D0D' },
      { name: 'Rive', devicon: 'figma/figma-original', color: 'FF4D4D' },
      { name: 'LottieFiles', devicon: 'aftereffects/aftereffects-original', color: '00DDB3' },
    ],
  },
  {
    id: 'video',
    label: 'Video & Motion',
    emoji: '🎬',
    tools: [
      { name: 'After Effects', slug: 'adobeaftereffects', color: '9999FF' },
      { name: 'Premiere Pro', slug: 'adobepremierepro', color: '9999FF' },
      { name: 'DaVinci Resolve', devicon: 'premierepro/premierepro-plain', color: 'FF6B35' },
      { name: 'CapCut', slug: 'bytedance', color: '00F2EA' },
      { name: 'Cinema 4D', devicon: 'blender/blender-original', color: '011A6B' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & SEO',
    emoji: '📈',
    tools: [
      { name: 'Google Ads', slug: 'googleads', color: '4285F4' },
      { name: 'Meta Ads', slug: 'meta', color: '0467DF' },
      { name: 'LinkedIn Ads', slug: 'linkedin', color: '0A66C2' },
      { name: 'Ahrefs', slug: 'ahrefs', color: 'FF7A59' },
      { name: 'SEMrush', slug: 'semrush', color: 'FF642D' },
      { name: 'Moz', slug: 'moz', color: '3C2861' },
      { name: 'Search Console', slug: 'google', color: '4285F4' },
      { name: 'Mailchimp', slug: 'mailchimp', color: 'FFE01B' },
      { name: 'Brevo', slug: 'brevo', color: '0092FF' },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    emoji: '🛒',
    tools: [
      { name: 'Shopify', slug: 'shopify', color: '7AB55C' },
      { name: 'WooCommerce', slug: 'woocommerce', color: '96588A' },
      { name: 'Magento', slug: 'magento', color: 'EE672F' },
      { name: 'BigCommerce', slug: 'bigcommerce', color: '121118' },
      { name: 'MedusaJS', devicon: 'nodejs/nodejs-original', color: '000000' },
    ],
  },
  {
    id: 'security',
    label: 'Security & Auth',
    emoji: '🔐',
    tools: [
      { name: 'OAuth', slug: 'auth0', color: '4285F4' },
      { name: 'JWT', devicon: 'json/json-original', color: 'FFFFFF' },
      { name: 'Auth0', slug: 'auth0', color: 'EB5424' },
      { name: 'Clerk', slug: 'clerk', color: '6C47FF' },
      { name: 'Firebase Auth', slug: 'firebase', color: 'DD2C00' },
      { name: 'Okta', slug: 'okta', color: '007DC1' },
      { name: 'Sentry', slug: 'sentry', color: '362D59' },
    ],
  },
  {
    id: 'devtools',
    label: 'Developer Tools',
    emoji: '🔧',
    tools: [
      { name: 'Git', slug: 'git', color: 'F05032' },
      { name: 'GitHub', slug: 'github', color: '181717' },
      { name: 'GitLab', slug: 'gitlab', color: 'FC6D26' },
      { name: 'Bitbucket', slug: 'bitbucket', color: '0052CC' },
      { name: 'VS Code', slug: 'visualstudiocode', color: '007ACC' },
      { name: 'Postman', slug: 'postman', color: 'FF6C37' },
      { name: 'Swagger', slug: 'swagger', color: '85EA2D' },
      { name: 'Docker', slug: 'docker', color: '2496ED' },
      { name: 'npm', slug: 'npm', color: 'CB3837' },
      { name: 'pnpm', slug: 'pnpm', color: 'F69220' },
      { name: 'Yarn', slug: 'yarn', color: '2C8EBB' },
    ],
  },
];

export const ALL_STACK_TOOLS: StackTool[] = TOOL_CATEGORIES.flatMap((cat) => cat.tools);

/** Split into two marquee rows */
export function splitToolsForMarquee(tools: StackTool[]): [StackTool[], StackTool[]] {
  const mid = Math.ceil(tools.length / 2);
  return [tools.slice(0, mid), tools.slice(mid)];
}

export interface LabsProject {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
  tags: string[];
}

export const LABS_PROJECTS: LabsProject[] = [
  {
    title: 'Sketch-to-Face Image Synthesis',
    description:
      'Synthesises realistic face images from hand-drawn sketches (or Canny edge maps) using the pSp encoder-decoder architecture trained on CelebA aligned face images. Pipeline: Hand-drawn sketch → Canny edge map → pSp encoder → StyleGAN2 decoder → Realistic face photo.',
    githubUrl: 'https://github.com/BILAL-ASIF-github/Sketch-to-Face-Image-Synthesis',
    tags: ['PyTorch', 'OpenCV', 'StyleGAN2', 'Computer Vision'],
  },
  {
    title: 'SecureScan AI',
    description:
      'Deep learning–based vulnerability detection for source code. CodeBERT embeddings → BiLSTM sequence modeling → MLP classifier, trained on 600,000+ CVE samples. Deployed as a live web app for real-time vulnerability predictions.',
    githubUrl: 'https://github.com/aly-abbas11/SecureScan-AI',
    liveUrl: 'https://securescan-ai.vercel.app',
    tags: ['CodeBERT', 'BiLSTM', 'Deep Learning', 'Security'],
  },
  {
    title: 'Multi-Architecture Brain Tumor Classification using Explainable AI',
    description:
      'Classifies brain MRI scans into Glioma, Meningioma, No Tumor, and Pituitary using a ResNet50 encoder with Squeeze-and-Excitation attention, trained on 5,491 clinically-sourced MRI images with Grad-CAM explainability.',
    githubUrl:
      'https://github.com/abdullahnoor2685/MRI-Based-Brain-Tumor-Detection-Using-Explainable-AI-and-Transfer-Learning',
    tags: ['ResNet50', 'Grad-CAM', 'Transfer Learning', 'Medical AI'],
  },
  {
    title: 'Low-Light Image Enhancement for Robust Object Detection',
    description:
      'Two-stage deep learning pipeline: U-Net CNN for pixel-wise low-light enhancement, then YOLOv8 object detection on enhanced images for robust performance in dark conditions.',
    githubUrl: 'https://github.com/Nimra-waseem-aftab/image_enhancement_and_detection',
    tags: ['YOLOv8', 'U-Net', 'OpenCV', 'Object Detection'],
  },
];
