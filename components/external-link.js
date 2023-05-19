import { OpenAIIcon, ReplicateIcon, GitHubIcon } from "./icons";

const ExternalLink = ({ link, ...props }) => {
  let icon = null;
  console.log("LINK", link);
  switch (link.name) {
    case "openai":
      icon = <OpenAIIcon {...props} />;
      break;
    case "replicate":
      icon = <ReplicateIcon {...props} />;
      break;
    case "github":
      icon = <GitHubIcon {...props} />;
      break;
    default:
      return null;
  }

  return (
    <a href={link.url} title={link.name} className="icon w-6 h-6">
      {icon}
    </a>
  );
};

export default ExternalLink;
