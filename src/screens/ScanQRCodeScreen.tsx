import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from "react-native";
import { Button } from "react-native-paper";

import QRScanner from "./QRScanner";
import { useAppContext } from '../context/AppContext';

const dWidth = Dimensions.get("window").width;

const clr1 = "dodgerblue";

const ScanQRCodeScreen = ({ navigation }) => {
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const { dispatch } = useAppContext();

    const openQRscanner = () => {
        setShowQR(true);
    };

    const onQrRead = (qrtext) => {
        setQrCode(qrtext);
        setShowQR(false);

        navigation.navigate("Task Report Screen", { qrCode: qrtext })
    };

    return (
        <View style={styles.page}>
            {qrCode ? (
                <Text style={{ fontSize: 16, color: "black" }}>
                    {"QR Value \n" + qrCode}
                </Text>
            ) : null}
            <Button mode="outlined" textColor='white' buttonColor={'dodgerblue'} onPress={() => openQRscanner()} contentStyle={{ width: "100%" }}>
                Scan QR
            </Button>
            {showQR ? <QRScanner onRead={onQrRead} /> : null}
        </View>
    );
};

export default ScanQRCodeScreen;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    btn: {
        backgroundColor: "transparent",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: "3%",
        width: "50%",
        borderWidth: 2,
        borderColor: clr1,
    },
    btnText: {
        color: clr1,
    },
});