import { useInView } from "react-intersection-observer";
interface InfinitScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}
export default function InfinitScrollContainer({
  children,
  onBottomReached,
  className,
}: InfinitScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
