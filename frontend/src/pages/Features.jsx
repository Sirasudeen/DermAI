import { Box } from '@mui/material'
import TiltedCard from "./../animations/Components/TiltedCard/TiltedCard"
import PageWrapper from '../components/PageWrapper'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';

const FeatureBox = ({ imageSrc, altText }) => {
    return (<TiltedCard
        imageSrc={imageSrc}
        altText={altText}
        captionText={altText}
        containerHeight="clamp(3rem,60vmin,40rem)"
        containerWidth="clamp(3rem,60vmin,40rem)"
        imageHeight="clamp(2rem,50vmin,30rem)"
        imageWidth="clamp(2rem,50vmin,30rem)"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
            <p className="tilted-card-demo-text">
            </p>
        }
    />)
}
const Features = () => {
    const smallScreen = useMediaQuery("(max-width:950px)");
    console.log(smallScreen)
    useEffect(() => {

    }, [smallScreen])
    return (

        < PageWrapper >
            <Box sx={{
                display: "flex",
                flexDirection: smallScreen ? "column" : "row",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}>

                <FeatureBox imageSrc="feature1.jpg" altText="Describe your skin concerns and get instant, intelligent suggestions." />
                <FeatureBox imageSrc="feature2.jpg" altText="Reliable & Evidence-Based" />
                <FeatureBox imageSrc="feature3.jpg" altText="Private, Friendly Assistant" />


            </Box>
        </PageWrapper >
    )
}

export default Features