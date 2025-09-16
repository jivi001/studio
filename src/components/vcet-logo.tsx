import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export function VcetLogo() {
  const { vcetShield } = placeholderImages;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <Image 
            src={vcetShield.src}
            width={vcetShield.width} 
            height={vcetShield.height}
            alt={vcetShield.alt}
            data-ai-hint={vcetShield.hint}
            className="h-14 w-auto"
        />
      </div>
    </div>
  );
}
