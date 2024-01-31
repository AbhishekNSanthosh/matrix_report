const UserIcon = (props) => {
  const { icon, iconProps, componentType } = props;
  const IconTag = icon;
  let styles;

  return <IconTag {...iconProps} style={{ ...styles }} />;
};

export default UserIcon;
