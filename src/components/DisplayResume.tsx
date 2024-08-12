import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'

type DisplayResumeProps = {
    markdown: string
}

export default function DisplayResume(props: DisplayResumeProps){
    // console.log(props)

    return(
            // <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
            <Markdown rehypePlugins={[rehypeRaw]}>{props.markdown}</Markdown>
            // <p>
            //     {props.markdown}
            // </p>
        )
}