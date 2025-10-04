import type { FaceShape, HairLength } from './types';

interface HairstylePrompt {
  label: string;
  note: string;
  prompt: string;
}

const BASE_PROMPT_STYLE = `
You are a world-class digital hairstylist. Edit the user's photo to give them a new hairstyle.
The final image MUST be a photorealistic, high-detail, half-body / medium shot.
The background MUST be a uniform light grey (#f0f0f0).
Use soft studio lighting (key light + fill) for gentle, flattering shadows.
PRESERVE the person's facial features and identity.
Maintain natural skin texture; do not heavily airbrush the skin.
Ensure the hair looks realistic, with natural strands, texture, and lighting.
The output image should be a high-quality photograph, not an illustration.
`;

const HAIRSTYLES: Record<HairLength, Record<'natural' | 'glamorous', HairstylePrompt[]>> = {
  short: {
    natural: [
      { label: 'Textured Pixie Cut', note: 'Adds volume on top to elongate the face.', prompt: `Style: A chic textured pixie cut with soft, piecey layers. Makeup: Natural, everyday look with light foundation and a nude lip.` },
      { label: 'Soft Wavy Bob', note: 'Softens angular features and adds movement.', prompt: `Style: A soft, wavy bob cut just below the chin with gentle waves. Makeup: Natural, everyday look with subtle blush and mascara.` },
      { label: 'Sleek Blunt Bob', note: 'A chic and timeless look that frames the face.', prompt: `Style: A sleek, sharp, blunt-cut bob at chin-length, styled straight. Makeup: Natural, everyday look.` },
      { label: 'Shaggy Bob with Bangs', note: 'Effortless texture that adds width and balances a longer face.', prompt: `Style: A messy, shaggy bob with wispy fringe bangs. Makeup: Natural, everyday look with a relaxed feel.` },
      { label: 'Side-Swept Crop', note: 'An elegant short style that highlights cheekbones.', prompt: `Style: A short crop, slightly longer on top and swept to the side. Makeup: Natural, everyday look.` },
      { label: 'Classic Bob with Fringe', note: 'A timeless look that can be styled for any occasion.', prompt: `Style: A classic French-style bob with a straight-across fringe. Makeup: Natural, everyday look.` },
      { label: 'Short & Curly', note: 'Embraces natural texture for a vibrant, youthful look.', prompt: `Style: Short, bouncy curls, styled to enhance their natural pattern. Makeup: Natural, everyday look.` },
      { label: 'Layered \'Bixie\' Cut', note: 'A hybrid of a bob and pixie for soft, feathered layers.', prompt: `Style: A "bixie" cut, blending the length of a bob with the layers of a pixie. Makeup: Natural, everyday look.` },
      { label: 'Asymmetrical Bob', note: 'An edgy, modern look that draws attention to the jawline.', prompt: `Style: An asymmetrical bob, cut shorter on one side than the other. Makeup: Natural, everyday look.` },
    ],
    glamorous: [
      { label: 'Glamorous Finger Waves', note: 'A vintage-inspired, elegant look for short hair.', prompt: `Style: Deep side part with glamorous, sculpted finger waves. Makeup: Glamorous evening look with a bold berry lip.` },
      { label: 'Slicked-Back Wet Look', note: 'A high-fashion, edgy, and sophisticated style.', prompt: `Style: A slicked-back wet look, pushed away from the face with a high-gloss finish. Makeup: Glamorous evening look with a smoky eye.` },
      { label: 'Voluminous Curly Bob', note: 'Big, bouncy curls create a dramatic and fun silhouette.', prompt: `Style: A voluminous, curly bob with defined, glossy curls. Makeup: Glamorous evening look with glowing skin and highlighter.` },
      { label: 'Deep Side Part with Gems', note: 'A sleek style accented with subtle hair jewels for sparkle.', prompt: `Style: A very deep side part with hair styled sleek and accented with a few small, sparkling hair gems. Makeup: Glamorous evening look.` },
      { label: 'Polished Asymmetrical Bob', note: 'A sharp, geometric cut styled with a high-gloss finish.', prompt: `Style: A sharp, asymmetrical bob, flat-ironed to perfection with a high-shine spray. Makeup: Glamorous evening look with sharp eyeliner.` },
      { label: 'Braided Side Sweep', note: 'A small, tight braid on one side adds an unexpected detail.', prompt: `Style: One side of the hair is pulled back in a tight, intricate braid, with the rest left sleek. Makeup: Glamorous evening look.` },
      { label: 'Faux Hawk Updo', note: 'Hair is styled up and back for a bold, rock-chic look.', prompt: `Style: Short hair is styled upwards and given volume to create a faux hawk effect. Makeup: Glamorous, edgy evening look.` },
      { label: 'Vintage Pin Curls', note: 'Classic, tight curls create a glamorous, retro effect.', prompt: `Style: Hair is set in tight, classic pin curls for a vintage Hollywood effect. Makeup: Glamorous evening look with a classic red lip.` },
      { label: 'Sculpted Micro-Fringe', note: 'A very short, sharp fringe for a high-fashion statement.', prompt: `Style: A sleek bob with a very short, sharp, straight micro-fringe. Makeup: High-fashion, glamorous look.` },
    ],
  },
  medium: {
    natural: [
      { label: 'Layered Lob with Waves', note: 'Adds texture and movement for an effortless feel.', prompt: `Style: A shoulder-length layered lob with soft, beachy waves. Makeup: Natural, everyday look.` },
      { label: 'Curtain Bangs & Layers', note: 'Frames the face beautifully and adds softness.', prompt: `Style: A shoulder-length cut with face-framing curtain bangs and soft layers. Makeup: Natural, everyday look.` },
      { label: 'Half-Up Top Knot', note: 'A casual yet stylish way to keep hair off the face.', prompt: `Style: A half-up top knot with the rest of the hair in loose waves. Makeup: Natural, everyday look.` },
      { label: 'Straight & Sleek Shoulder Cut', note: 'Polished and professional, this style is effortlessly chic.', prompt: `Style: Shoulder-length hair styled perfectly straight and sleek. Makeup: Natural, everyday look.` },
      { label: 'Messy Bun with Tendrils', note: 'The perfect \'undone\' look that is both casual and romantic.', prompt: `Style: A loose, messy bun with soft tendrils left out to frame the face. Makeup: Natural, everyday look.` },
      { label: 'Low Ponytail with Ribbon', note: 'A simple ponytail elevated with a silk ribbon or scarf.', prompt: `Style: A simple low ponytail tied with an elegant silk ribbon. Makeup: Natural, everyday look.` },
      { label: 'Dutch Braid Crown', note: 'Two braids wrapped around the head for a bohemian vibe.', prompt: `Style: Two Dutch braids starting from the temples and wrapped around the back of the head. Makeup: Natural, everyday look.` },
      { label: 'Modern Shag Cut', note: 'Lots of choppy layers create volume and a cool, retro feel.', prompt: `Style: A modern shag haircut with choppy layers and lots of texture. Makeup: Natural, everyday look.` },
      { label: 'Face-Framing Blowout', note: 'A smooth blowout with layers curled to frame the face.', prompt: `Style: A professional blowout with layers gently curled inwards to frame the face. Makeup: Natural, everyday look.` },
    ],
    glamorous: [
      { label: 'Polished High Ponytail', note: 'A sleek and sophisticated look that elevates any outfit.', prompt: `Style: A sleek, high ponytail with a hair wrap around the base. Makeup: Glamorous evening look with sharp eyeliner.` },
      { label: 'Voluminous Side-Swept Waves', note: 'Classic Hollywood glamour with lots of body and shine.', prompt: `Style: A deep side part with voluminous, glossy waves swept to one side. Makeup: Glamorous evening look with a red lip.` },
      { label: 'Braided Crown Updo', note: 'An elegant and romantic style perfect for special occasions.', prompt: `Style: A beautiful braided crown updo with a few soft tendrils framing the face. Makeup: Glamorous evening look with soft, glowing makeup.` },
      { label: 'Old Hollywood Curls', note: 'Soft, uniform curls create a timeless, glamorous look.', prompt: `Style: Medium-length hair styled in classic, soft Old Hollywood curls. Makeup: Glamorous evening look.` },
      { label: 'Sleek Center Part & Tucked', note: 'Hair is perfectly straight and tucked behind the ears.', prompt: `Style: Perfectly straight, sleek hair with a sharp center part, tucked neatly behind both ears. Makeup: Minimalist, glamorous look.` },
      { label: 'Half-Up Bouffant', note: 'Volume at the crown creates a dramatic, 60s-inspired silhouette.', prompt: `Style: A half-up style with significant volume (a bouffant) at the crown. Makeup: Glamorous evening look with winged eyeliner.` },
      { label: 'Textured Chignon', note: 'A low bun with woven texture and soft, escaped pieces.', prompt: `Style: A low chignon at the nape of the neck with lots of woven texture and soft, loose pieces. Makeup: Romantic, glamorous look.` },
      { label: 'Glass Hair Lob', note: 'An ultra-sleek, straight lob with a mirror-like shine.', prompt: `Style: A shoulder-length "glass hair" lob, which is ultra-straight, sharp, and intensely glossy. Makeup: Glamorous evening look.` },
      { label: 'Twisted Low Updo', note: 'Hair is twisted into an intricate but soft bun at the nape.', prompt: `Style: An intricate low updo created from multiple twists of hair. Makeup: Elegant, glamorous evening look.` },
    ],
  },
  long: {
    natural: [
      { label: 'Long Beach Waves', note: 'Effortless and timeless, adding texture and volume.', prompt: `Style: Long, flowing beach waves with a center part. Makeup: Natural, everyday look.` },
      { label: 'Low Ponytail with Layers', note: 'A chic and simple style with face-framing pieces.', prompt: `Style: A low, loose ponytail with face-framing layers left out. Makeup: Natural, everyday look.` },
      { label: 'Soft Voluminous Blowout', note: 'Creates body and movement for a healthy, polished look.', prompt: `Style: A classic soft, voluminous blowout with a slight bounce at the ends. Makeup: Natural, everyday look.` },
      { label: 'Classic Fishtail Braid', note: 'A beautiful and intricate braid, kept slightly loose.', prompt: `Style: A loose, slightly messy fishtail braid over one shoulder. Makeup: Natural, everyday look.` },
      { label: 'High Messy Bun', note: 'A full bun piled high on the head for a casual, cool look.', prompt: `Style: A full, messy bun piled high on the top of the head. Makeup: Natural, everyday look.` },
      { label: 'Long Layers, Center Part', note: 'Simple and beautiful, allowing length to be the focus.', prompt: `Style: Long hair with subtle layers and a clean center part. Makeup: Natural, everyday look.` },
      { label: 'Half-Up Braid', note: 'A small braid pulls the top section of hair back neatly.', prompt: `Style: A half-up style where the top sections are pulled back in a simple braid. Makeup: Natural, everyday look.` },
      { label: 'Embraced Natural Curls', note: 'Long, healthy curls styled to enhance their natural pattern.', prompt: `Style: Long, naturally curly hair, styled to be defined and frizz-free. Makeup: Natural, everyday look.` },
      { label: 'Straight and Polished', note: 'A sleek, flat-ironed look that emphasizes shine and length.', prompt: `Style: Long hair styled perfectly straight and polished with a glossy finish. Makeup: Natural, everyday look.` },
    ],
    glamorous: [
      { label: 'Voluminous Mermaid Waves', note: 'Dramatic and eye-catching with deep, uniform waves.', prompt: `Style: Long, voluminous mermaid waves with a glossy finish. Makeup: Glamorous evening look with a defined contour.` },
      { label: 'Sleek Low Chignon', note: 'An elegant and sophisticated updo for formal events.', prompt: `Style: A sleek and polished low chignon at the nape of the neck. Makeup: Glamorous evening look with a classic red lip.` },
      { label: 'Intricate Twisted Updo', note: 'An elegant updo with interwoven twists and face-framing tendrils.', prompt: `Style: An elegant twisted updo with face-framing tendrils. Makeup: Glamorous evening look with a smoky eye.` },
      { label: 'High Sleek Ponytail', note: 'A power look, with long, straight hair pulled tightly back.', prompt: `Style: A very high and sleek ponytail, with perfectly straight, long hair. Makeup: Sharp, glamorous look with a winged eyeliner.` },
      { label: 'Bombshell Curls', note: 'Big, bouncy, voluminous curls for maximum drama.', prompt: `Style: Big, bouncy, voluminous "bombshell" curls parted to the side. Makeup: Full glam evening look.` },
      { label: 'Crown Braid Updo', note: 'A thick braid wraps around the head like a crown for a regal look.', prompt: `Style: A thick Dutch or French braid wrapped around the top of the head like a crown. Makeup: Regal, glamorous look.` },
      { label: 'Side-Swept Glamour Waves', note: 'All hair is swept over one shoulder in deep, glossy waves.', prompt: `Style: A deep side part with all hair swept over one shoulder in deep, glossy waves. Makeup: Classic Hollywood glamour look.` },
      { label: 'Bubble Ponytail', note: 'A modern, fun take on a ponytail with elastic-defined \'bubbles\'.', prompt: `Style: A high ponytail sectioned into "bubbles" with hair elastics down its length. Makeup: Modern, fun, glamorous look.` },
      { label: 'Half-Up Hollywood Waves', note: 'The top is sleek and pulled back, while the lengths fall in perfect waves.', prompt: `Style: A half-up style, with the top section pulled back sleekly and the remaining hair in perfect, glossy Hollywood waves. Makeup: Polished, glamorous look.` },
    ],
  },
};


const FACE_SHAPE_NOTES: Record<FaceShape, string> = {
  oval: "Your oval face shape is versatile and complements most hairstyles.",
  round: "For your round face, we will select styles that add height and elongate your features.",
  square: "For your square face, we will focus on softer styles with waves and layers to soften angles.",
  heart: "For your heart-shaped face, we will choose styles that add volume around the chin and jawline.",
  diamond: "For your diamond face, we will use styles that soften the cheekbones and balance your features.",
  long: "For your long face, we will add width with volume, curls, and horizontal lines."
};

export const getHairstylePrompts = (faceShape: FaceShape, hairLength: HairLength) => {
    const faceShapeGuidance = FACE_SHAPE_NOTES[faceShape];
    
    // Use the first 9 unique prompts defined for each category.
    const naturalPrompts = HAIRSTYLES[hairLength]['natural'].slice(0, 9).map(p => ({
        ...p,
        prompt: `${BASE_PROMPT_STYLE}\n${p.prompt}\nClient guidance: ${faceShapeGuidance}`
    }));

    const glamorousPrompts = HAIRSTYLES[hairLength]['glamorous'].slice(0, 9).map(p => ({
        ...p,
        prompt: `${BASE_PROMPT_STYLE}\n${p.prompt}\nClient guidance: ${faceShapeGuidance}`
    }));

    return {
        natural: naturalPrompts,
        glamorous: glamorousPrompts
    };
};
