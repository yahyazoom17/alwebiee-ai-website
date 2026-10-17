/**
 * GENERATED from assets/logo/master-a.svg — do not edit by hand.
 *
 * Regenerate rather than hand-tweaking: the path data below is the production
 * master artwork with strokes already expanded to filled outlines, so it scales
 * and prints predictably. It is inlined (not loaded as a file) purely so that
 * `currentColor` can tint it for the light and dark themes without shipping a
 * second asset or a webfont for the wordmark.
 */

type WovenFrameProps = {
  className?: string;
  title?: string;
};

export function WovenFrame({
  className,
  title = "Alwebiee",
}: WovenFrameProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* The Woven Frame — two threads interlaced into one rounded frame. */}
      <path fill="currentColor" fillRule="nonzero" d="
      M 35 66 L 142 66 A 48 48 0 0 1 190 114 L 190 157 L 162 157 L 162 114 A 20 20 0 0 0 142 94 L 35 94 Z
      M 221 190 L 114 190 A 48 48 0 0 1 66 142 L 66 99 L 94 99 L 94 142 A 20 20 0 0 0 114 162 L 221 162 Z
      M 162 195 L 190 195 L 190 221 L 162 221 Z
      M 66 35 L 94 35 L 94 61 L 66 61 Z
      " />
    </svg>
  );
}
