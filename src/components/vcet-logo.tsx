import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export function VcetLogo() {
  const { vcetShield } = placeholderImages;
  return (
    <div className="flex items-center justify-center">
      <Image 
          src={vcetShield.src}
          width={vcetShield.width} 
          height={vcetShield.height}
          alt={vcetShield.alt}
          data-ai-hint={vcetShield.hint}
          className="h-16 w-auto"
      />
    </div>
  );
}
