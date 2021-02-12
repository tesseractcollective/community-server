import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";

import { Typography } from "@material-ui/core";

export default (props: any) => {
  const { value, source, label, record } = props;

  const code = value || record[source];

  return (
    <div>
      <Typography
        variant="caption"
        color="textSecondary"
      >
        {label || source}
      </Typography>
      <AceEditor
        style={{ width: "100%", minWidth: 400 }}
        mode="yaml"
        theme="github"
        readOnly={true}
        minLines={20}
        maxLines={40}
        wrapEnabled={true}
        editorProps={{ $blockScrolling: true }}
        value={code}
      />
    </div>
  );
};
