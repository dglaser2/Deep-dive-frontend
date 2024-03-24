import { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data }) {

    const [prompt, setPrompt] = useState('')
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <View style={styles.Node}>
            <Text>I would like to learn...</Text>

            <TextInput onChangeText={setPrompt} />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.onboardingSubmitButton}>
                    Submit
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TextUpdaterNode;

const styles = StyleSheet.create({
    Node: {
        height: 100,
        borderColor: '#eee',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },

    label: {
        color: '#777',
        fontSize: 12
    },
    onboardingSubmitButton: {
        alignItems: 'center',
        width: '70%',
        borderRadius: 25,
        borderWidth: 1,
        padding: 10,
        marginTop: 30,
    },
    inputContainer: {
        width: '80%',
        borderColor: 'grey',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 25
    }
});

