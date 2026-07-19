export interface StackTool {
  name: string;
  slug?: string;
  devicon?: string;
  color?: string;
}

/** Curated, modern stack — one entry per technology, no duplicates. */
export const CURATED_STACK_TOOLS: StackTool[] = [
  { name: 'OpenAI', slug: 'openai', color: 'FFFFFF' },
  { name: 'Anthropic', slug: 'anthropic', color: 'FFFFFF' },
  { name: 'LangChain', slug: 'langchain', color: 'FFFFFF' },
  { name: 'Python', slug: 'python', color: 'FFFFFF' },
  { name: 'PyTorch', slug: 'pytorch', color: 'FFFFFF' },
  { name: 'n8n', slug: 'n8n', color: 'FFFFFF' },
  { name: 'Make', slug: 'make', color: 'FFFFFF' },
  { name: 'Zapier', slug: 'zapier', color: 'FFFFFF' },
  { name: 'TypeScript', slug: 'typescript', color: 'FFFFFF' },
  { name: 'JavaScript', slug: 'javascript', color: 'FFFFFF' },
  { name: 'React', slug: 'react', color: 'FFFFFF' },
  { name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: 'FFFFFF' },
  { name: 'Node.js', slug: 'nodedotjs', color: 'FFFFFF' },
  { name: 'FastAPI', slug: 'fastapi', color: 'FFFFFF' },
  { name: 'Flutter', slug: 'flutter', color: 'FFFFFF' },
  { name: 'PostgreSQL', slug: 'postgresql', color: 'FFFFFF' },
  { name: 'MongoDB', slug: 'mongodb', color: 'FFFFFF' },
  { name: 'Redis', slug: 'redis', color: 'FFFFFF' },
  { name: 'Supabase', slug: 'supabase', color: 'FFFFFF' },
  { name: 'Firebase', slug: 'firebase', color: 'FFFFFF' },
  { name: 'Stripe', slug: 'stripe', color: 'FFFFFF' },
  { name: 'Prisma', slug: 'prisma', color: 'FFFFFF' },
  { name: 'Figma', slug: 'figma', color: 'FFFFFF' },
  { name: 'Framer', slug: 'framer', color: 'FFFFFF' },
  { name: 'Docker', slug: 'docker', color: 'FFFFFF' },
  { name: 'GitHub', slug: 'github', color: 'FFFFFF' },
  { name: 'Vercel', slug: 'vercel', color: 'FFFFFF' },
  { name: 'Google Analytics', slug: 'googleanalytics', color: 'FFFFFF' },
  { name: 'PostHog', slug: 'posthog', color: 'FFFFFF' },
  { name: 'HubSpot', slug: 'hubspot', color: 'FFFFFF' },
  { name: 'Shopify', slug: 'shopify', color: 'FFFFFF' },
];

export function dedupeStackTools(tools: StackTool[]): StackTool[] {
  const seen = new Set<string>();
  return tools.filter((tool) => {
    const key = (tool.slug ?? tool.name).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const ALL_STACK_TOOLS = dedupeStackTools(CURATED_STACK_TOOLS);

/** Split into two disjoint marquee rows with no overlap. */
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
