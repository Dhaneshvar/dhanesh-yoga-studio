import React from "react";

interface Props {
  id: string;
  title: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

const SectionMarker: React.FC<Props> = ({ id, title, className, as: Tag = "section", children }) => {
  const Component = Tag as any;
  return (
    <Component data-voice-section={id} data-voice-title={title} className={className}>
      {children}
    </Component>
  );
};

export default SectionMarker;
